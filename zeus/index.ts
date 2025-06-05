/* eslint-disable */

import { AllTypesProps, ReturnTypes, Ops } from './const';


export const HOST="Specify host"


export const HEADERS = {}
export const apiSubscription = (options: chainOptions) => (query: string) => {
  try {
    const queryString = options[0] + '?query=' + encodeURIComponent(query);
    const wsString = queryString.replace('http', 'ws');
    const host = (options.length > 1 && options[1]?.websocket?.[0]) || wsString;
    const webSocketOptions = options[1]?.websocket || [host];
    const ws = new WebSocket(...webSocketOptions);
    return {
      ws,
      on: (e: (args: any) => void) => {
        ws.onmessage = (event: any) => {
          if (event.data) {
            const parsed = JSON.parse(event.data);
            const data = parsed.data;
            return e(data);
          }
        };
      },
      off: (e: (args: any) => void) => {
        ws.onclose = e;
      },
      error: (e: (args: any) => void) => {
        ws.onerror = e;
      },
      open: (e: () => void) => {
        ws.onopen = e;
      },
    };
  } catch {
    throw new Error('No websockets implemented');
  }
};
const handleFetchResponse = (response: Response): Promise<GraphQLResponse> => {
  if (!response.ok) {
    return new Promise((_, reject) => {
      response
        .text()
        .then((text) => {
          try {
            reject(JSON.parse(text));
          } catch (err) {
            reject(text);
          }
        })
        .catch(reject);
    });
  }
  return response.json() as Promise<GraphQLResponse>;
};

export const apiFetch =
  (options: fetchOptions) =>
  (query: string, variables: Record<string, unknown> = {}) => {
    const fetchOptions = options[1] || {};
    if (fetchOptions.method && fetchOptions.method === 'GET') {
      return fetch(`${options[0]}?query=${encodeURIComponent(query)}`, fetchOptions)
        .then(handleFetchResponse)
        .then((response: GraphQLResponse) => {
          if (response.errors) {
            throw new GraphQLError(response);
          }
          return response.data;
        });
    }
    return fetch(`${options[0]}`, {
      body: JSON.stringify({ query, variables }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      ...fetchOptions,
    })
      .then(handleFetchResponse)
      .then((response: GraphQLResponse) => {
        if (response.errors) {
          throw new GraphQLError(response);
        }
        return response.data;
      });
  };

export const InternalsBuildQuery = ({
  ops,
  props,
  returns,
  options,
  scalars,
}: {
  props: AllTypesPropsType;
  returns: ReturnTypesType;
  ops: Operations;
  options?: OperationOptions;
  scalars?: ScalarDefinition;
}) => {
  const ibb = (
    k: string,
    o: InputValueType | VType,
    p = '',
    root = true,
    vars: Array<{ name: string; graphQLType: string }> = [],
  ): string => {
    const keyForPath = purifyGraphQLKey(k);
    const newPath = [p, keyForPath].join(SEPARATOR);
    if (!o) {
      return '';
    }
    if (typeof o === 'boolean' || typeof o === 'number') {
      return k;
    }
    if (typeof o === 'string') {
      return `${k} ${o}`;
    }
    if (Array.isArray(o)) {
      const args = InternalArgsBuilt({
        props,
        returns,
        ops,
        scalars,
        vars,
      })(o[0], newPath);
      return `${ibb(args ? `${k}(${args})` : k, o[1], p, false, vars)}`;
    }
    if (k === '__alias') {
      return Object.entries(o)
        .map(([alias, objectUnderAlias]) => {
          if (typeof objectUnderAlias !== 'object' || Array.isArray(objectUnderAlias)) {
            throw new Error(
              'Invalid alias it should be __alias:{ YOUR_ALIAS_NAME: { OPERATION_NAME: { ...selectors }}}',
            );
          }
          const operationName = Object.keys(objectUnderAlias)[0];
          const operation = objectUnderAlias[operationName];
          return ibb(`${alias}:${operationName}`, operation, p, false, vars);
        })
        .join('\n');
    }
    const hasOperationName = root && options?.operationName ? ' ' + options.operationName : '';
    const keyForDirectives = o.__directives ?? '';
    const query = `{${Object.entries(o)
      .filter(([k]) => k !== '__directives')
      .map((e) => ibb(...e, [p, `field<>${keyForPath}`].join(SEPARATOR), false, vars))
      .join('\n')}}`;
    if (!root) {
      return `${k} ${keyForDirectives}${hasOperationName} ${query}`;
    }
    const varsString = vars.map((v) => `${v.name}: ${v.graphQLType}`).join(', ');
    return `${k} ${keyForDirectives}${hasOperationName}${varsString ? `(${varsString})` : ''} ${query}`;
  };
  return ibb;
};

type UnionOverrideKeys<T, U> = Omit<T, keyof U> & U;

export const Thunder =
  <SCLR extends ScalarDefinition>(fn: FetchFunction, thunderGraphQLOptions?: ThunderGraphQLOptions<SCLR>) =>
  <O extends keyof typeof Ops, OVERRIDESCLR extends SCLR, R extends keyof ValueTypes = GenericOperation<O>>(
    operation: O,
    graphqlOptions?: ThunderGraphQLOptions<OVERRIDESCLR>,
  ) =>
  <Z extends ValueTypes[R]>(
    o: Z & {
      [P in keyof Z]: P extends keyof ValueTypes[R] ? Z[P] : never;
    },
    ops?: OperationOptions & { variables?: Record<string, unknown> },
  ) => {
    const options = {
      ...thunderGraphQLOptions,
      ...graphqlOptions,
    };
    return fn(
      Zeus(operation, o, {
        operationOptions: ops,
        scalars: options?.scalars,
      }),
      ops?.variables,
    ).then((data) => {
      if (options?.scalars) {
        return decodeScalarsInResponse({
          response: data,
          initialOp: operation,
          initialZeusQuery: o as VType,
          returns: ReturnTypes,
          scalars: options.scalars,
          ops: Ops,
        });
      }
      return data;
    }) as Promise<InputType<GraphQLTypes[R], Z, UnionOverrideKeys<SCLR, OVERRIDESCLR>>>;
  };

export const Chain = (...options: chainOptions) => Thunder(apiFetch(options));

export const SubscriptionThunder =
  <SCLR extends ScalarDefinition>(fn: SubscriptionFunction, thunderGraphQLOptions?: ThunderGraphQLOptions<SCLR>) =>
  <O extends keyof typeof Ops, OVERRIDESCLR extends SCLR, R extends keyof ValueTypes = GenericOperation<O>>(
    operation: O,
    graphqlOptions?: ThunderGraphQLOptions<OVERRIDESCLR>,
  ) =>
  <Z extends ValueTypes[R]>(
    o: Z & {
      [P in keyof Z]: P extends keyof ValueTypes[R] ? Z[P] : never;
    },
    ops?: OperationOptions & { variables?: ExtractVariables<Z> },
  ) => {
    const options = {
      ...thunderGraphQLOptions,
      ...graphqlOptions,
    };
    type CombinedSCLR = UnionOverrideKeys<SCLR, OVERRIDESCLR>;
    const returnedFunction = fn(
      Zeus(operation, o, {
        operationOptions: ops,
        scalars: options?.scalars,
      }),
    ) as SubscriptionToGraphQL<Z, GraphQLTypes[R], CombinedSCLR>;
    if (returnedFunction?.on && options?.scalars) {
      const wrapped = returnedFunction.on;
      returnedFunction.on = (fnToCall: (args: InputType<GraphQLTypes[R], Z, CombinedSCLR>) => void) =>
        wrapped((data: InputType<GraphQLTypes[R], Z, CombinedSCLR>) => {
          if (options?.scalars) {
            return fnToCall(
              decodeScalarsInResponse({
                response: data,
                initialOp: operation,
                initialZeusQuery: o as VType,
                returns: ReturnTypes,
                scalars: options.scalars,
                ops: Ops,
              }),
            );
          }
          return fnToCall(data);
        });
    }
    return returnedFunction;
  };

export const Subscription = (...options: chainOptions) => SubscriptionThunder(apiSubscription(options));
export const Zeus = <
  Z extends ValueTypes[R],
  O extends keyof typeof Ops,
  R extends keyof ValueTypes = GenericOperation<O>,
>(
  operation: O,
  o: Z,
  ops?: {
    operationOptions?: OperationOptions;
    scalars?: ScalarDefinition;
  },
) =>
  InternalsBuildQuery({
    props: AllTypesProps,
    returns: ReturnTypes,
    ops: Ops,
    options: ops?.operationOptions,
    scalars: ops?.scalars,
  })(operation, o as VType);

export const ZeusSelect = <T>() => ((t: unknown) => t) as SelectionFunction<T>;

export const Selector = <T extends keyof ValueTypes>(key: T) => key && ZeusSelect<ValueTypes[T]>();

export const TypeFromSelector = <T extends keyof ValueTypes>(key: T) => key && ZeusSelect<ValueTypes[T]>();
export const Gql = Chain(HOST, {
  headers: {
    'Content-Type': 'application/json',
    ...HEADERS,
  },
});

export const ZeusScalars = ZeusSelect<ScalarCoders>();

export const decodeScalarsInResponse = <O extends Operations>({
  response,
  scalars,
  returns,
  ops,
  initialZeusQuery,
  initialOp,
}: {
  ops: O;
  response: any;
  returns: ReturnTypesType;
  scalars?: Record<string, ScalarResolver | undefined>;
  initialOp: keyof O;
  initialZeusQuery: InputValueType | VType;
}) => {
  if (!scalars) {
    return response;
  }
  const builder = PrepareScalarPaths({
    ops,
    returns,
  });

  const scalarPaths = builder(initialOp as string, ops[initialOp], initialZeusQuery);
  if (scalarPaths) {
    const r = traverseResponse({ scalarPaths, resolvers: scalars })(initialOp as string, response, [ops[initialOp]]);
    return r;
  }
  return response;
};

export const traverseResponse = ({
  resolvers,
  scalarPaths,
}: {
  scalarPaths: { [x: string]: `scalar.${string}` };
  resolvers: {
    [x: string]: ScalarResolver | undefined;
  };
}) => {
  const ibb = (k: string, o: InputValueType | VType, p: string[] = []): unknown => {
    if (Array.isArray(o)) {
      return o.map((eachO) => ibb(k, eachO, p));
    }
    if (o == null) {
      return o;
    }
    const scalarPathString = p.join(SEPARATOR);
    const currentScalarString = scalarPaths[scalarPathString];
    if (currentScalarString) {
      const currentDecoder = resolvers[currentScalarString.split('.')[1]]?.decode;
      if (currentDecoder) {
        return currentDecoder(o);
      }
    }
    if (typeof o === 'boolean' || typeof o === 'number' || typeof o === 'string' || !o) {
      return o;
    }
    const entries = Object.entries(o).map(([k, v]) => [k, ibb(k, v, [...p, purifyGraphQLKey(k)])] as const);
    const objectFromEntries = entries.reduce<Record<string, unknown>>((a, [k, v]) => {
      a[k] = v;
      return a;
    }, {});
    return objectFromEntries;
  };
  return ibb;
};

export type AllTypesPropsType = {
  [x: string]:
    | undefined
    | `scalar.${string}`
    | 'enum'
    | {
        [x: string]:
          | undefined
          | string
          | {
              [x: string]: string | undefined;
            };
      };
};

export type ReturnTypesType = {
  [x: string]:
    | {
        [x: string]: string | undefined;
      }
    | `scalar.${string}`
    | undefined;
};
export type InputValueType = {
  [x: string]: undefined | boolean | string | number | [any, undefined | boolean | InputValueType] | InputValueType;
};
export type VType =
  | undefined
  | boolean
  | string
  | number
  | [any, undefined | boolean | InputValueType]
  | InputValueType;

export type PlainType = boolean | number | string | null | undefined;
export type ZeusArgsType =
  | PlainType
  | {
      [x: string]: ZeusArgsType;
    }
  | Array<ZeusArgsType>;

export type Operations = Record<string, string>;

export type VariableDefinition = {
  [x: string]: unknown;
};

export const SEPARATOR = '|';

export type fetchOptions = Parameters<typeof fetch>;
type websocketOptions = typeof WebSocket extends new (...args: infer R) => WebSocket ? R : never;
export type chainOptions = [fetchOptions[0], fetchOptions[1] & { websocket?: websocketOptions }] | [fetchOptions[0]];
export type FetchFunction = (query: string, variables?: Record<string, unknown>) => Promise<any>;
export type SubscriptionFunction = (query: string) => any;
type NotUndefined<T> = T extends undefined ? never : T;
export type ResolverType<F> = NotUndefined<F extends [infer ARGS, any] ? ARGS : undefined>;

export type OperationOptions = {
  operationName?: string;
};

export type ScalarCoder = Record<string, (s: unknown) => string>;

export interface GraphQLResponse {
  data?: Record<string, any>;
  errors?: Array<{
    message: string;
  }>;
}
export class GraphQLError extends Error {
  constructor(public response: GraphQLResponse) {
    super('');
    console.error(response);
  }
  toString() {
    return 'GraphQL Response Error';
  }
}
export type GenericOperation<O> = O extends keyof typeof Ops ? typeof Ops[O] : never;
export type ThunderGraphQLOptions<SCLR extends ScalarDefinition> = {
  scalars?: SCLR | ScalarCoders;
};

const ExtractScalar = (mappedParts: string[], returns: ReturnTypesType): `scalar.${string}` | undefined => {
  if (mappedParts.length === 0) {
    return;
  }
  const oKey = mappedParts[0];
  const returnP1 = returns[oKey];
  if (typeof returnP1 === 'object') {
    const returnP2 = returnP1[mappedParts[1]];
    if (returnP2) {
      return ExtractScalar([returnP2, ...mappedParts.slice(2)], returns);
    }
    return undefined;
  }
  return returnP1 as `scalar.${string}` | undefined;
};

export const PrepareScalarPaths = ({ ops, returns }: { returns: ReturnTypesType; ops: Operations }) => {
  const ibb = (
    k: string,
    originalKey: string,
    o: InputValueType | VType,
    p: string[] = [],
    pOriginals: string[] = [],
    root = true,
  ): { [x: string]: `scalar.${string}` } | undefined => {
    if (!o) {
      return;
    }
    if (typeof o === 'boolean' || typeof o === 'number' || typeof o === 'string') {
      const extractionArray = [...pOriginals, originalKey];
      const isScalar = ExtractScalar(extractionArray, returns);
      if (isScalar?.startsWith('scalar')) {
        const partOfTree = {
          [[...p, k].join(SEPARATOR)]: isScalar,
        };
        return partOfTree;
      }
      return {};
    }
    if (Array.isArray(o)) {
      return ibb(k, k, o[1], p, pOriginals, false);
    }
    if (k === '__alias') {
      return Object.entries(o)
        .map(([alias, objectUnderAlias]) => {
          if (typeof objectUnderAlias !== 'object' || Array.isArray(objectUnderAlias)) {
            throw new Error(
              'Invalid alias it should be __alias:{ YOUR_ALIAS_NAME: { OPERATION_NAME: { ...selectors }}}',
            );
          }
          const operationName = Object.keys(objectUnderAlias)[0];
          const operation = objectUnderAlias[operationName];
          return ibb(alias, operationName, operation, p, pOriginals, false);
        })
        .reduce((a, b) => ({
          ...a,
          ...b,
        }));
    }
    const keyName = root ? ops[k] : k;
    return Object.entries(o)
      .filter(([k]) => k !== '__directives')
      .map(([k, v]) => {
        // Inline fragments shouldn't be added to the path as they aren't a field
        const isInlineFragment = originalKey.match(/^...\s*on/) != null;
        return ibb(
          k,
          k,
          v,
          isInlineFragment ? p : [...p, purifyGraphQLKey(keyName || k)],
          isInlineFragment ? pOriginals : [...pOriginals, purifyGraphQLKey(originalKey)],
          false,
        );
      })
      .reduce((a, b) => ({
        ...a,
        ...b,
      }));
  };
  return ibb;
};

export const purifyGraphQLKey = (k: string) => k.replace(/\([^)]*\)/g, '').replace(/^[^:]*\:/g, '');

const mapPart = (p: string) => {
  const [isArg, isField] = p.split('<>');
  if (isField) {
    return {
      v: isField,
      __type: 'field',
    } as const;
  }
  return {
    v: isArg,
    __type: 'arg',
  } as const;
};

type Part = ReturnType<typeof mapPart>;

export const ResolveFromPath = (props: AllTypesPropsType, returns: ReturnTypesType, ops: Operations) => {
  const ResolvePropsType = (mappedParts: Part[]) => {
    const oKey = ops[mappedParts[0].v];
    const propsP1 = oKey ? props[oKey] : props[mappedParts[0].v];
    if (propsP1 === 'enum' && mappedParts.length === 1) {
      return 'enum';
    }
    if (typeof propsP1 === 'string' && propsP1.startsWith('scalar.') && mappedParts.length === 1) {
      return propsP1;
    }
    if (typeof propsP1 === 'object') {
      if (mappedParts.length < 2) {
        return 'not';
      }
      const propsP2 = propsP1[mappedParts[1].v];
      if (typeof propsP2 === 'string') {
        return rpp(
          `${propsP2}${SEPARATOR}${mappedParts
            .slice(2)
            .map((mp) => mp.v)
            .join(SEPARATOR)}`,
        );
      }
      if (typeof propsP2 === 'object') {
        if (mappedParts.length < 3) {
          return 'not';
        }
        const propsP3 = propsP2[mappedParts[2].v];
        if (propsP3 && mappedParts[2].__type === 'arg') {
          return rpp(
            `${propsP3}${SEPARATOR}${mappedParts
              .slice(3)
              .map((mp) => mp.v)
              .join(SEPARATOR)}`,
          );
        }
      }
    }
  };
  const ResolveReturnType = (mappedParts: Part[]) => {
    if (mappedParts.length === 0) {
      return 'not';
    }
    const oKey = ops[mappedParts[0].v];
    const returnP1 = oKey ? returns[oKey] : returns[mappedParts[0].v];
    if (typeof returnP1 === 'object') {
      if (mappedParts.length < 2) return 'not';
      const returnP2 = returnP1[mappedParts[1].v];
      if (returnP2) {
        return rpp(
          `${returnP2}${SEPARATOR}${mappedParts
            .slice(2)
            .map((mp) => mp.v)
            .join(SEPARATOR)}`,
        );
      }
    }
  };
  const rpp = (path: string): 'enum' | 'not' | `scalar.${string}` => {
    const parts = path.split(SEPARATOR).filter((l) => l.length > 0);
    const mappedParts = parts.map(mapPart);
    const propsP1 = ResolvePropsType(mappedParts);
    if (propsP1) {
      return propsP1;
    }
    const returnP1 = ResolveReturnType(mappedParts);
    if (returnP1) {
      return returnP1;
    }
    return 'not';
  };
  return rpp;
};

export const InternalArgsBuilt = ({
  props,
  ops,
  returns,
  scalars,
  vars,
}: {
  props: AllTypesPropsType;
  returns: ReturnTypesType;
  ops: Operations;
  scalars?: ScalarDefinition;
  vars: Array<{ name: string; graphQLType: string }>;
}) => {
  const arb = (a: ZeusArgsType, p = '', root = true): string => {
    if (typeof a === 'string') {
      if (a.startsWith(START_VAR_NAME)) {
        const [varName, graphQLType] = a.replace(START_VAR_NAME, '$').split(GRAPHQL_TYPE_SEPARATOR);
        const v = vars.find((v) => v.name === varName);
        if (!v) {
          vars.push({
            name: varName,
            graphQLType,
          });
        } else {
          if (v.graphQLType !== graphQLType) {
            throw new Error(
              `Invalid variable exists with two different GraphQL Types, "${v.graphQLType}" and ${graphQLType}`,
            );
          }
        }
        return varName;
      }
    }
    const checkType = ResolveFromPath(props, returns, ops)(p);
    if (checkType.startsWith('scalar.')) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...splittedScalar] = checkType.split('.');
      const scalarKey = splittedScalar.join('.');
      return (scalars?.[scalarKey]?.encode?.(a) as string) || JSON.stringify(a);
    }
    if (Array.isArray(a)) {
      return `[${a.map((arr) => arb(arr, p, false)).join(', ')}]`;
    }
    if (typeof a === 'string') {
      if (checkType === 'enum') {
        return a;
      }
      return `${JSON.stringify(a)}`;
    }
    if (typeof a === 'object') {
      if (a === null) {
        return `null`;
      }
      const returnedObjectString = Object.entries(a)
        .filter(([, v]) => typeof v !== 'undefined')
        .map(([k, v]) => `${k}: ${arb(v, [p, k].join(SEPARATOR), false)}`)
        .join(',\n');
      if (!root) {
        return `{${returnedObjectString}}`;
      }
      return returnedObjectString;
    }
    return `${a}`;
  };
  return arb;
};

export const resolverFor = <X, T extends keyof ResolverInputTypes, Z extends keyof ResolverInputTypes[T]>(
  type: T,
  field: Z,
  fn: (
    args: Required<ResolverInputTypes[T]>[Z] extends [infer Input, any] ? Input : any,
    source: any,
  ) => Z extends keyof ModelTypes[T] ? ModelTypes[T][Z] | Promise<ModelTypes[T][Z]> | X : never,
) => fn as (args?: any, source?: any) => ReturnType<typeof fn>;

export type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;
export type ZeusState<T extends (...args: any[]) => Promise<any>> = NonNullable<UnwrapPromise<ReturnType<T>>>;
export type ZeusHook<
  T extends (...args: any[]) => Record<string, (...args: any[]) => Promise<any>>,
  N extends keyof ReturnType<T>,
> = ZeusState<ReturnType<T>[N]>;

export type WithTypeNameValue<T> = T & {
  __typename?: boolean;
  __directives?: string;
};
export type AliasType<T> = WithTypeNameValue<T> & {
  __alias?: Record<string, WithTypeNameValue<T>>;
};
type DeepAnify<T> = {
  [P in keyof T]?: any;
};
type IsPayLoad<T> = T extends [any, infer PayLoad] ? PayLoad : T;
export type ScalarDefinition = Record<string, ScalarResolver>;

type IsScalar<S, SCLR extends ScalarDefinition> = S extends 'scalar' & { name: infer T }
  ? T extends keyof SCLR
    ? SCLR[T]['decode'] extends (s: unknown) => unknown
      ? ReturnType<SCLR[T]['decode']>
      : unknown
    : unknown
  : S;
type IsArray<T, U, SCLR extends ScalarDefinition> = T extends Array<infer R>
  ? InputType<R, U, SCLR>[]
  : InputType<T, U, SCLR>;
type FlattenArray<T> = T extends Array<infer R> ? R : T;
type BaseZeusResolver = boolean | 1 | string | Variable<any, string>;

type IsInterfaced<SRC extends DeepAnify<DST>, DST, SCLR extends ScalarDefinition> = FlattenArray<SRC> extends
  | ZEUS_INTERFACES
  | ZEUS_UNIONS
  ? {
      [P in keyof SRC]: SRC[P] extends '__union' & infer R
        ? P extends keyof DST
          ? IsArray<R, '__typename' extends keyof DST ? DST[P] & { __typename: true } : DST[P], SCLR>
          : IsArray<R, '__typename' extends keyof DST ? { __typename: true } : Record<string, never>, SCLR>
        : never;
    }[keyof SRC] & {
      [P in keyof Omit<
        Pick<
          SRC,
          {
            [P in keyof DST]: SRC[P] extends '__union' & infer R ? never : P;
          }[keyof DST]
        >,
        '__typename'
      >]: IsPayLoad<DST[P]> extends BaseZeusResolver ? IsScalar<SRC[P], SCLR> : IsArray<SRC[P], DST[P], SCLR>;
    }
  : {
      [P in keyof Pick<SRC, keyof DST>]: IsPayLoad<DST[P]> extends BaseZeusResolver
        ? IsScalar<SRC[P], SCLR>
        : IsArray<SRC[P], DST[P], SCLR>;
    };

export type MapType<SRC, DST, SCLR extends ScalarDefinition> = SRC extends DeepAnify<DST>
  ? IsInterfaced<SRC, DST, SCLR>
  : never;
// eslint-disable-next-line @typescript-eslint/ban-types
export type InputType<SRC, DST, SCLR extends ScalarDefinition = {}> = IsPayLoad<DST> extends { __alias: infer R }
  ? {
      [P in keyof R]: MapType<SRC, R[P], SCLR>[keyof MapType<SRC, R[P], SCLR>];
    } & MapType<SRC, Omit<IsPayLoad<DST>, '__alias'>, SCLR>
  : MapType<SRC, IsPayLoad<DST>, SCLR>;
export type SubscriptionToGraphQL<Z, T, SCLR extends ScalarDefinition> = {
  ws: WebSocket;
  on: (fn: (args: InputType<T, Z, SCLR>) => void) => void;
  off: (fn: (e: { data?: InputType<T, Z, SCLR>; code?: number; reason?: string; message?: string }) => void) => void;
  error: (fn: (e: { data?: InputType<T, Z, SCLR>; errors?: string[] }) => void) => void;
  open: () => void;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type FromSelector<SELECTOR, NAME extends keyof GraphQLTypes, SCLR extends ScalarDefinition = {}> = InputType<
  GraphQLTypes[NAME],
  SELECTOR,
  SCLR
>;

export type ScalarResolver = {
  encode?: (s: unknown) => string;
  decode?: (s: unknown) => unknown;
};

export type SelectionFunction<V> = <Z extends V>(
  t: Z & {
    [P in keyof Z]: P extends keyof V ? Z[P] : never;
  },
) => Z;

type BuiltInVariableTypes = {
  ['String']: string;
  ['Int']: number;
  ['Float']: number;
  ['ID']: unknown;
  ['Boolean']: boolean;
};
type AllVariableTypes = keyof BuiltInVariableTypes | keyof ZEUS_VARIABLES;
type VariableRequired<T extends string> = `${T}!` | T | `[${T}]` | `[${T}]!` | `[${T}!]` | `[${T}!]!`;
type VR<T extends string> = VariableRequired<VariableRequired<T>>;

export type GraphQLVariableType = VR<AllVariableTypes>;

type ExtractVariableTypeString<T extends string> = T extends VR<infer R1>
  ? R1 extends VR<infer R2>
    ? R2 extends VR<infer R3>
      ? R3 extends VR<infer R4>
        ? R4 extends VR<infer R5>
          ? R5
          : R4
        : R3
      : R2
    : R1
  : T;

type DecomposeType<T, Type> = T extends `[${infer R}]`
  ? Array<DecomposeType<R, Type>> | undefined
  : T extends `${infer R}!`
  ? NonNullable<DecomposeType<R, Type>>
  : Type | undefined;

type ExtractTypeFromGraphQLType<T extends string> = T extends keyof ZEUS_VARIABLES
  ? ZEUS_VARIABLES[T]
  : T extends keyof BuiltInVariableTypes
  ? BuiltInVariableTypes[T]
  : any;

export type GetVariableType<T extends string> = DecomposeType<
  T,
  ExtractTypeFromGraphQLType<ExtractVariableTypeString<T>>
>;

type UndefinedKeys<T> = {
  [K in keyof T]-?: T[K] extends NonNullable<T[K]> ? never : K;
}[keyof T];

type WithNullableKeys<T> = Pick<T, UndefinedKeys<T>>;
type WithNonNullableKeys<T> = Omit<T, UndefinedKeys<T>>;

type OptionalKeys<T> = {
  [P in keyof T]?: T[P];
};

export type WithOptionalNullables<T> = OptionalKeys<WithNullableKeys<T>> & WithNonNullableKeys<T>;

export type Variable<T extends GraphQLVariableType, Name extends string> = {
  ' __zeus_name': Name;
  ' __zeus_type': T;
};

export type ExtractVariablesDeep<Query> = Query extends Variable<infer VType, infer VName>
  ? { [key in VName]: GetVariableType<VType> }
  : Query extends string | number | boolean | Array<string | number | boolean>
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    {}
  : UnionToIntersection<{ [K in keyof Query]: WithOptionalNullables<ExtractVariablesDeep<Query[K]>> }[keyof Query]>;

export type ExtractVariables<Query> = Query extends Variable<infer VType, infer VName>
  ? { [key in VName]: GetVariableType<VType> }
  : Query extends [infer Inputs, infer Outputs]
  ? ExtractVariablesDeep<Inputs> & ExtractVariables<Outputs>
  : Query extends string | number | boolean | Array<string | number | boolean>
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    {}
  : UnionToIntersection<{ [K in keyof Query]: WithOptionalNullables<ExtractVariables<Query[K]>> }[keyof Query]>;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export const START_VAR_NAME = `$ZEUS_VAR`;
export const GRAPHQL_TYPE_SEPARATOR = `__$GRAPHQL__`;

export const $ = <Type extends GraphQLVariableType, Name extends string>(name: Name, graphqlType: Type) => {
  return (START_VAR_NAME + name + GRAPHQL_TYPE_SEPARATOR + graphqlType) as unknown as Variable<Type, Name>;
};
type ZEUS_INTERFACES = never
export type ScalarCoders = {
}
type ZEUS_UNIONS = GraphQLTypes["SearchResultFields"]

export type ValueTypes = {
    ["ArtistInput"]: {
	id: string | Variable<any, string>,
	name: string | Variable<any, string>,
	ownership: number | Variable<any, string>
};
	["CollaboratorInput"]: {
	name: string | Variable<any, string>,
	role: string | Variable<any, string>,
	ownership: number | Variable<any, string>
};
	["CollaboratorOutput"]: AliasType<{
	name?:boolean | `@${string}`,
	role?:boolean | `@${string}`,
	ownership?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ExplicitLyrics"]:ExplicitLyrics;
	["ReleaseStatus"]:ReleaseStatus;
	["ReleaseType"]:ReleaseType;
	["LicenceType"]:LicenceType;
	["PriceCategory"]:PriceCategory;
	["ArtworkCopyrightInput"]: {
	name?: string | undefined | null | Variable<any, string>,
	year?: number | undefined | null | Variable<any, string>
};
	["ArtworkCopyrightOutput"]: AliasType<{
	name?:boolean | `@${string}`,
	year?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ReleaseOwnerInput"]: {
	name?: string | undefined | null | Variable<any, string>,
	year?: number | undefined | null | Variable<any, string>
};
	["ReleaseOwnerOutput"]: AliasType<{
	name?:boolean | `@${string}`,
	year?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["SongInput"]: {
	audio_path: string | Variable<any, string>,
	album_art?: string | undefined | null | Variable<any, string>,
	title: string | Variable<any, string>,
	duration: number | Variable<any, string>,
	lyrics?: string | undefined | null | Variable<any, string>,
	explicit_lyrics?: ValueTypes["ExplicitLyrics"] | undefined | null | Variable<any, string>,
	licence_type: ValueTypes["LicenceType"] | Variable<any, string>,
	legal_owner_of_release: ValueTypes["ReleaseOwnerInput"] | Variable<any, string>,
	primary_genre: string | Variable<any, string>,
	secondary_genre?: string | undefined | null | Variable<any, string>,
	remix_or_version?: string | undefined | null | Variable<any, string>,
	available_separately?: boolean | undefined | null | Variable<any, string>,
	is_instrumental?: boolean | undefined | null | Variable<any, string>,
	language_of_the_lyrics?: string | undefined | null | Variable<any, string>,
	secondary_language_of_the_lyrics?: string | undefined | null | Variable<any, string>,
	new_isrc_code?: boolean | undefined | null | Variable<any, string>,
	isrc_code?: string | undefined | null | Variable<any, string>,
	iswc_code?: string | undefined | null | Variable<any, string>,
	artists: Array<ValueTypes["CollaboratorInput"]> | Variable<any, string>,
	notes?: string | undefined | null | Variable<any, string>
};
	["SongStatus"]:SongStatus;
	["SongOutput"]: AliasType<{
	id?:boolean | `@${string}`,
	audio_path?:boolean | `@${string}`,
	album_art?:boolean | `@${string}`,
	title?:boolean | `@${string}`,
	duration?:boolean | `@${string}`,
	lyrics?:boolean | `@${string}`,
	explicit_lyrics?:boolean | `@${string}`,
	licence_type?:boolean | `@${string}`,
	legal_owner_of_release?:ValueTypes["ReleaseOwnerOutput"],
	primary_genre?:boolean | `@${string}`,
	secondary_genre?:boolean | `@${string}`,
	remix_or_version?:boolean | `@${string}`,
	available_separately?:boolean | `@${string}`,
	is_instrumental?:boolean | `@${string}`,
	language_of_the_lyrics?:boolean | `@${string}`,
	secondary_language_of_the_lyrics?:boolean | `@${string}`,
	new_isrc_code?:boolean | `@${string}`,
	isrc_code?:boolean | `@${string}`,
	iswc_code?:boolean | `@${string}`,
	artists?:ValueTypes["CollaboratorOutput"],
	notes?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ListEntityByArtistInput"]: {
	artistId: string | Variable<any, string>,
	nextToken?: string | undefined | null | Variable<any, string>,
	pageSize?: number | undefined | null | Variable<any, string>
};
	["ArtistOutput"]: AliasType<{
	id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["SongUpdateInput"]: {
	id: string | Variable<any, string>,
	title?: string | undefined | null | Variable<any, string>,
	album_art?: string | undefined | null | Variable<any, string>,
	lyrics?: string | undefined | null | Variable<any, string>,
	explicit_lyrics?: ValueTypes["ExplicitLyrics"] | undefined | null | Variable<any, string>,
	licence_type?: ValueTypes["LicenceType"] | undefined | null | Variable<any, string>,
	legal_owner_of_release?: ValueTypes["ReleaseOwnerInput"] | undefined | null | Variable<any, string>,
	primary_genre?: string | undefined | null | Variable<any, string>,
	secondary_genre?: string | undefined | null | Variable<any, string>,
	remix_or_version?: string | undefined | null | Variable<any, string>,
	available_separately?: boolean | undefined | null | Variable<any, string>,
	is_instrumental?: boolean | undefined | null | Variable<any, string>,
	language_of_the_lyrics?: string | undefined | null | Variable<any, string>,
	secondary_language_of_the_lyrics?: string | undefined | null | Variable<any, string>,
	new_isrc_code?: boolean | undefined | null | Variable<any, string>,
	isrc_code?: string | undefined | null | Variable<any, string>,
	iswc_code?: string | undefined | null | Variable<any, string>,
	artists?: Array<ValueTypes["CollaboratorInput"]> | undefined | null | Variable<any, string>,
	notes?: string | undefined | null | Variable<any, string>
};
	["BasicSongOutput"]: AliasType<{
	id?:boolean | `@${string}`,
	duration?:boolean | `@${string}`,
	release_art?:boolean | `@${string}`,
	audio_path?:boolean | `@${string}`,
	title?:boolean | `@${string}`,
	artists?:ValueTypes["ArtistOutput"],
		__typename?: boolean | `@${string}`
}>;
	["BasicSongInput"]: {
	id: string | Variable<any, string>,
	title: string | Variable<any, string>,
	duration: number | Variable<any, string>,
	release_art: string | Variable<any, string>,
	audio_path: string | Variable<any, string>,
	artists: Array<ValueTypes["ArtistInput"]> | Variable<any, string>
};
	["OwnershipOutput"]: AliasType<{
	name?:boolean | `@${string}`,
	share?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["UserInput"]: {
	name?: string | undefined | null | Variable<any, string>,
	locale?: string | undefined | null | Variable<any, string>,
	nickname?: string | undefined | null | Variable<any, string>,
	bio?: string | undefined | null | Variable<any, string>,
	email?: string | undefined | null | Variable<any, string>,
	preferred_username?: string | undefined | null | Variable<any, string>,
	based_country?: string | undefined | null | Variable<any, string>,
	based_region?: string | undefined | null | Variable<any, string>,
	address?: string | undefined | null | Variable<any, string>,
	website?: string | undefined | null | Variable<any, string>,
	updated_at?: string | undefined | null | Variable<any, string>,
	picture?: string | undefined | null | Variable<any, string>,
	followers?: string | undefined | null | Variable<any, string>,
	monthly_plays?: string | undefined | null | Variable<any, string>,
	downloads?: string | undefined | null | Variable<any, string>,
	is_artist?: boolean | undefined | null | Variable<any, string>,
	country?: string | undefined | null | Variable<any, string>,
	email_alerts?: string | undefined | null | Variable<any, string>,
	instagram?: string | undefined | null | Variable<any, string>,
	twitter?: string | undefined | null | Variable<any, string>,
	youtube?: string | undefined | null | Variable<any, string>,
	facebook?: string | undefined | null | Variable<any, string>,
	role?: Array<string | undefined | null> | undefined | null | Variable<any, string>,
	influencers?: Array<string | undefined | null> | undefined | null | Variable<any, string>,
	genre?: Array<string | undefined | null> | undefined | null | Variable<any, string>
};
	["UserOutput"]: AliasType<{
	sub?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	locale?:boolean | `@${string}`,
	nickname?:boolean | `@${string}`,
	bio?:boolean | `@${string}`,
	email?:boolean | `@${string}`,
	preferred_username?:boolean | `@${string}`,
	based_region?:boolean | `@${string}`,
	based_country?:boolean | `@${string}`,
	address?:boolean | `@${string}`,
	website?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
	picture?:boolean | `@${string}`,
	followers?:boolean | `@${string}`,
	monthly_plays?:boolean | `@${string}`,
	downloads?:boolean | `@${string}`,
	is_artist?:boolean | `@${string}`,
	country?:boolean | `@${string}`,
	email_alerts?:boolean | `@${string}`,
	instagram?:boolean | `@${string}`,
	twitter?:boolean | `@${string}`,
	youtube?:boolean | `@${string}`,
	facebook?:boolean | `@${string}`,
	role?:boolean | `@${string}`,
	influencers?:boolean | `@${string}`,
	genre?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PaginatedArtistInput"]: {
	artistId: string | Variable<any, string>,
	nextToken?: string | undefined | null | Variable<any, string>,
	pageSize?: number | undefined | null | Variable<any, string>
};
	["PaginatedSongsOutput"]: AliasType<{
	nextToken?:boolean | `@${string}`,
	songs?:ValueTypes["SongOutput"],
		__typename?: boolean | `@${string}`
}>;
	["IdentityInput"]: {
	request_upc?: boolean | undefined | null | Variable<any, string>,
	upc?: string | undefined | null | Variable<any, string>,
	request_ref_no?: boolean | undefined | null | Variable<any, string>,
	reference_number?: string | undefined | null | Variable<any, string>
};
	["IdentityOutput"]: AliasType<{
	request_upc?:boolean | `@${string}`,
	upc?:boolean | `@${string}`,
	request_ref_no?:boolean | `@${string}`,
	reference_number?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ReleaseInfoInput"]: {
	version?: string | undefined | null | Variable<any, string>,
	title_language?: string | undefined | null | Variable<any, string>,
	release_type?: ValueTypes["ReleaseType"] | undefined | null | Variable<any, string>,
	cover_art?: string | undefined | null | Variable<any, string>,
	primary_genre?: string | undefined | null | Variable<any, string>,
	secondary_genre?: string | undefined | null | Variable<any, string>,
	artists?: Array<ValueTypes["CollaboratorInput"] | undefined | null> | undefined | null | Variable<any, string>,
	label: string | Variable<any, string>,
	identity?: ValueTypes["IdentityInput"] | undefined | null | Variable<any, string>,
	release_description?: string | undefined | null | Variable<any, string>
};
	["LicenceInput"]: {
	digital_release_date: string | Variable<any, string>,
	original_release_date: string | Variable<any, string>,
	licence_type: ValueTypes["LicenceType"] | Variable<any, string>,
	legal_owner_of_work: ValueTypes["ReleaseOwnerInput"] | Variable<any, string>,
	legal_owner_of_release: ValueTypes["ReleaseOwnerInput"] | Variable<any, string>,
	price_category: ValueTypes["PriceCategory"] | Variable<any, string>,
	excluded_territories?: Array<string | undefined | null> | undefined | null | Variable<any, string>
};
	["ReleaseInput"]: {
	title: string | Variable<any, string>,
	release_info: ValueTypes["ReleaseInfoInput"] | Variable<any, string>,
	licence: ValueTypes["LicenceInput"] | Variable<any, string>,
	distribution_platforms: Array<string> | Variable<any, string>,
	status: ValueTypes["ReleaseStatus"] | Variable<any, string>
};
	["ReleaseUpdateInput"]: {
	id: string | Variable<any, string>,
	title?: string | undefined | null | Variable<any, string>,
	release_info?: ValueTypes["ReleaseInfoInput"] | undefined | null | Variable<any, string>,
	licence?: ValueTypes["LicenceInput"] | undefined | null | Variable<any, string>,
	distribution_platforms?: Array<string> | undefined | null | Variable<any, string>,
	status?: ValueTypes["ReleaseStatus"] | undefined | null | Variable<any, string>
};
	["ReleaseInfoOutput"]: AliasType<{
	version?:boolean | `@${string}`,
	title_language?:boolean | `@${string}`,
	release_type?:boolean | `@${string}`,
	cover_art?:boolean | `@${string}`,
	primary_genre?:boolean | `@${string}`,
	secondary_genre?:boolean | `@${string}`,
	artists?:ValueTypes["CollaboratorOutput"],
	label?:boolean | `@${string}`,
	identity?:ValueTypes["IdentityOutput"],
	release_description?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["LicenceOutput"]: AliasType<{
	digital_release_date?:boolean | `@${string}`,
	original_release_date?:boolean | `@${string}`,
	licence_type?:boolean | `@${string}`,
	legal_owner_of_work?:ValueTypes["ReleaseOwnerOutput"],
	legal_owner_of_release?:ValueTypes["ReleaseOwnerOutput"],
	price_category?:boolean | `@${string}`,
	excluded_territories?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ReleaseOutput"]: AliasType<{
	id?:boolean | `@${string}`,
	title?:boolean | `@${string}`,
	release_info?:ValueTypes["ReleaseInfoOutput"],
	licence?:ValueTypes["LicenceOutput"],
	distribution_platforms?:boolean | `@${string}`,
	status?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["SongReleaseInput"]: {
	id: string | Variable<any, string>,
	title: string | Variable<any, string>
};
	["SongReleaseOutput"]: AliasType<{
	id?:boolean | `@${string}`,
	title?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ImgUploadResult"]: AliasType<{
	id?:boolean | `@${string}`,
	uploadURL?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ImageUploadUrlOutput"]: AliasType<{
	result?:ValueTypes["ImgUploadResult"],
	result_info?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	errors?:boolean | `@${string}`,
	messages?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["SearchField"]:SearchField;
	["LatexSearchInput"]: {
	entity: ValueTypes["SearchField"] | Variable<any, string>,
	username?: string | undefined | null | Variable<any, string>,
	query?: string | undefined | null | Variable<any, string>,
	size?: number | undefined | null | Variable<any, string>,
	page?: number | undefined | null | Variable<any, string>
};
	["SimpleSearchInput"]: {
	query?: string | undefined | null | Variable<any, string>,
	size?: number | undefined | null | Variable<any, string>,
	page?: number | undefined | null | Variable<any, string>
};
	["AddVideoInput"]: {
	title: string | Variable<any, string>,
	streamId: string | Variable<any, string>,
	description?: string | undefined | null | Variable<any, string>,
	thumbnail_ts?: number | undefined | null | Variable<any, string>
};
	["SongSearchField"]: AliasType<{
	id?:boolean | `@${string}`,
	entity_type?:boolean | `@${string}`,
	artists?:boolean | `@${string}`,
	title?:boolean | `@${string}`,
	subtitle?:boolean | `@${string}`,
	lyrics?:boolean | `@${string}`,
	genre?:boolean | `@${string}`,
	publisher?:boolean | `@${string}`,
	release_art?:boolean | `@${string}`,
	audio_path?:boolean | `@${string}`,
	stream_count?:boolean | `@${string}`,
	duration?:boolean | `@${string}`,
	release_date?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ReleaseSearchField"]: AliasType<{
	id?:boolean | `@${string}`,
	entity_type?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	release_date?:boolean | `@${string}`,
	release_art?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ArtistSearchField"]: AliasType<{
	id?:boolean | `@${string}`,
	entity_type?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	bio?:boolean | `@${string}`,
	role?:boolean | `@${string}`,
	picture?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["SearchResultFields"]: AliasType<{		["...on SongSearchField"] : ValueTypes["SongSearchField"],
		["...on ReleaseSearchField"] : ValueTypes["ReleaseSearchField"],
		["...on ArtistSearchField"] : ValueTypes["ArtistSearchField"]
		__typename?: boolean | `@${string}`
}>;
	["SearchHit"]: AliasType<{
	id?:boolean | `@${string}`,
	fields?:ValueTypes["SearchResultFields"],
		__typename?: boolean | `@${string}`
}>;
	["SearchResult"]: AliasType<{
	found?:boolean | `@${string}`,
	start?:boolean | `@${string}`,
	hit?:ValueTypes["SearchHit"],
		__typename?: boolean | `@${string}`
}>;
	["AllSearchHit"]: AliasType<{
	artist?:ValueTypes["ArtistSearchField"],
	release?:ValueTypes["ReleaseSearchField"],
	song?:ValueTypes["SongSearchField"],
		__typename?: boolean | `@${string}`
}>;
	["AllSearchResult"]: AliasType<{
	found?:boolean | `@${string}`,
	start?:boolean | `@${string}`,
	hit?:ValueTypes["AllSearchHit"],
		__typename?: boolean | `@${string}`
}>;
	["PaginatedReleasesOutput"]: AliasType<{
	releases?:ValueTypes["ReleaseOutput"],
	nextToken?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PaginatedListArtistsOutput"]: AliasType<{
	artists?:ValueTypes["UserOutput"],
	nextToken?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PaginatedBasicSongOutput"]: AliasType<{
	songs?:ValueTypes["BasicSongOutput"],
	nextToken?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PaginatedSongIdsOutput"]: AliasType<{
	songs?:boolean | `@${string}`,
	nextToken?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PaginatedReleaseOutput"]: AliasType<{
	releases?:ValueTypes["ReleaseOutput"],
	nextToken?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["TransactWriteOutput"]: AliasType<{
	message?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["GetCountriesOutput"]: AliasType<{
	countries?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["SuccessOutput"]: AliasType<{
	success?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["VideoOutput"]: AliasType<{
	id?:boolean | `@${string}`,
	title?:boolean | `@${string}`,
	streamId?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	thumbnail_ts?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PaginatedVideosOutput"]: AliasType<{
	videos?:ValueTypes["VideoOutput"],
	nextToken?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["GetVideoUploadUrlOutput"]: AliasType<{
	uploadUrl?:boolean | `@${string}`,
	streamId?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Mutation"]: AliasType<{
putSong?: [{	input: ValueTypes["SongInput"] | Variable<any, string>},ValueTypes["TransactWriteOutput"]],
updateSong?: [{	input: ValueTypes["SongUpdateInput"] | Variable<any, string>},ValueTypes["TransactWriteOutput"]],
putRelease?: [{	input: ValueTypes["ReleaseInput"] | Variable<any, string>},ValueTypes["ReleaseOutput"]],
updateRelease?: [{	input: ValueTypes["ReleaseUpdateInput"] | Variable<any, string>},ValueTypes["ReleaseOutput"]],
deleteRelease?: [{	id: string | Variable<any, string>},ValueTypes["ReleaseOutput"]],
deleteSong?: [{	id: string | Variable<any, string>},ValueTypes["SongOutput"]],
addSongToRelease?: [{	songIds?: Array<string> | undefined | null | Variable<any, string>,	releaseId: string | Variable<any, string>},ValueTypes["SuccessOutput"]],
deleteSongFromRelease?: [{	songIds?: Array<string> | undefined | null | Variable<any, string>,	releaseId: string | Variable<any, string>},ValueTypes["SuccessOutput"]],
updateUser?: [{	input?: ValueTypes["UserInput"] | undefined | null | Variable<any, string>},ValueTypes["UserOutput"]],
likeSong?: [{	songId: string | Variable<any, string>,	artistId: string | Variable<any, string>},ValueTypes["TransactWriteOutput"]],
unlikeSong?: [{	songId: string | Variable<any, string>,	artistId: string | Variable<any, string>},ValueTypes["TransactWriteOutput"]],
follow?: [{	userId: string | Variable<any, string>},ValueTypes["TransactWriteOutput"]],
unfollow?: [{	userId: string | Variable<any, string>},ValueTypes["TransactWriteOutput"]],
createImgUploadUrl?: [{	id?: string | undefined | null | Variable<any, string>},ValueTypes["ImageUploadUrlOutput"]],
addVideo?: [{	input?: ValueTypes["AddVideoInput"] | undefined | null | Variable<any, string>},ValueTypes["VideoOutput"]],
deleteVideo?: [{	id: string | Variable<any, string>},ValueTypes["SuccessOutput"]],
		__typename?: boolean | `@${string}`
}>;
	["Query"]: AliasType<{
searchItem?: [{	input?: ValueTypes["LatexSearchInput"] | undefined | null | Variable<any, string>},ValueTypes["SearchResult"]],
searchAll?: [{	input?: ValueTypes["SimpleSearchInput"] | undefined | null | Variable<any, string>},ValueTypes["AllSearchResult"]],
getSongById?: [{	songId: string | Variable<any, string>},ValueTypes["SongOutput"]],
getAllSongs?: [{	nextToken?: string | undefined | null | Variable<any, string>,	pageSize?: number | undefined | null | Variable<any, string>},ValueTypes["SongOutput"]],
getSongsByArtist?: [{	input: ValueTypes["PaginatedArtistInput"] | Variable<any, string>},ValueTypes["PaginatedSongsOutput"]],
getSongsOfRelease?: [{	releaseId: string | Variable<any, string>,	artistId: string | Variable<any, string>},ValueTypes["PaginatedSongsOutput"]],
getReleasesOfSong?: [{	songId: string | Variable<any, string>,	pageSize?: number | undefined | null | Variable<any, string>},ValueTypes["PaginatedReleaseOutput"]],
getReleaseById?: [{	releaseId: string | Variable<any, string>},ValueTypes["ReleaseOutput"]],
getReleasesByArtist?: [{	input?: ValueTypes["PaginatedArtistInput"] | undefined | null | Variable<any, string>},ValueTypes["PaginatedReleasesOutput"]],
	getUser?:ValueTypes["UserOutput"],
getUserById?: [{	userId: string | Variable<any, string>},ValueTypes["UserOutput"]],
listArtists?: [{	nextToken?: string | undefined | null | Variable<any, string>,	pageSize?: number | undefined | null | Variable<any, string>},ValueTypes["PaginatedListArtistsOutput"]],
getCountries?: [{	region: string | Variable<any, string>},ValueTypes["GetCountriesOutput"]],
getIsSongLiked?: [{	songId: string | Variable<any, string>},boolean | `@${string}`],
getIsFollowed?: [{	userId: string | Variable<any, string>},boolean | `@${string}`],
listLikedSongIds?: [{	nextToken?: string | undefined | null | Variable<any, string>,	pageSize?: number | undefined | null | Variable<any, string>},ValueTypes["PaginatedSongIdsOutput"]],
getVideoUploadUrl?: [{	bytes: number | Variable<any, string>},ValueTypes["GetVideoUploadUrlOutput"]],
listAllVideosByArtist?: [{	input: ValueTypes["ListEntityByArtistInput"] | Variable<any, string>},ValueTypes["PaginatedVideosOutput"]],
getVideo?: [{	id?: string | undefined | null | Variable<any, string>},ValueTypes["VideoOutput"]],
		__typename?: boolean | `@${string}`
}>
  }

export type ResolverInputTypes = {
    ["ArtistInput"]: {
	id: string,
	name: string,
	ownership: number
};
	["CollaboratorInput"]: {
	name: string,
	role: string,
	ownership: number
};
	["CollaboratorOutput"]: AliasType<{
	name?:boolean | `@${string}`,
	role?:boolean | `@${string}`,
	ownership?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ExplicitLyrics"]:ExplicitLyrics;
	["ReleaseStatus"]:ReleaseStatus;
	["ReleaseType"]:ReleaseType;
	["LicenceType"]:LicenceType;
	["PriceCategory"]:PriceCategory;
	["ArtworkCopyrightInput"]: {
	name?: string | undefined | null,
	year?: number | undefined | null
};
	["ArtworkCopyrightOutput"]: AliasType<{
	name?:boolean | `@${string}`,
	year?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ReleaseOwnerInput"]: {
	name?: string | undefined | null,
	year?: number | undefined | null
};
	["ReleaseOwnerOutput"]: AliasType<{
	name?:boolean | `@${string}`,
	year?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["SongInput"]: {
	audio_path: string,
	album_art?: string | undefined | null,
	title: string,
	duration: number,
	lyrics?: string | undefined | null,
	explicit_lyrics?: ResolverInputTypes["ExplicitLyrics"] | undefined | null,
	licence_type: ResolverInputTypes["LicenceType"],
	legal_owner_of_release: ResolverInputTypes["ReleaseOwnerInput"],
	primary_genre: string,
	secondary_genre?: string | undefined | null,
	remix_or_version?: string | undefined | null,
	available_separately?: boolean | undefined | null,
	is_instrumental?: boolean | undefined | null,
	language_of_the_lyrics?: string | undefined | null,
	secondary_language_of_the_lyrics?: string | undefined | null,
	new_isrc_code?: boolean | undefined | null,
	isrc_code?: string | undefined | null,
	iswc_code?: string | undefined | null,
	artists: Array<ResolverInputTypes["CollaboratorInput"]>,
	notes?: string | undefined | null
};
	["SongStatus"]:SongStatus;
	["SongOutput"]: AliasType<{
	id?:boolean | `@${string}`,
	audio_path?:boolean | `@${string}`,
	album_art?:boolean | `@${string}`,
	title?:boolean | `@${string}`,
	duration?:boolean | `@${string}`,
	lyrics?:boolean | `@${string}`,
	explicit_lyrics?:boolean | `@${string}`,
	licence_type?:boolean | `@${string}`,
	legal_owner_of_release?:ResolverInputTypes["ReleaseOwnerOutput"],
	primary_genre?:boolean | `@${string}`,
	secondary_genre?:boolean | `@${string}`,
	remix_or_version?:boolean | `@${string}`,
	available_separately?:boolean | `@${string}`,
	is_instrumental?:boolean | `@${string}`,
	language_of_the_lyrics?:boolean | `@${string}`,
	secondary_language_of_the_lyrics?:boolean | `@${string}`,
	new_isrc_code?:boolean | `@${string}`,
	isrc_code?:boolean | `@${string}`,
	iswc_code?:boolean | `@${string}`,
	artists?:ResolverInputTypes["CollaboratorOutput"],
	notes?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ListEntityByArtistInput"]: {
	artistId: string,
	nextToken?: string | undefined | null,
	pageSize?: number | undefined | null
};
	["ArtistOutput"]: AliasType<{
	id?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["SongUpdateInput"]: {
	id: string,
	title?: string | undefined | null,
	album_art?: string | undefined | null,
	lyrics?: string | undefined | null,
	explicit_lyrics?: ResolverInputTypes["ExplicitLyrics"] | undefined | null,
	licence_type?: ResolverInputTypes["LicenceType"] | undefined | null,
	legal_owner_of_release?: ResolverInputTypes["ReleaseOwnerInput"] | undefined | null,
	primary_genre?: string | undefined | null,
	secondary_genre?: string | undefined | null,
	remix_or_version?: string | undefined | null,
	available_separately?: boolean | undefined | null,
	is_instrumental?: boolean | undefined | null,
	language_of_the_lyrics?: string | undefined | null,
	secondary_language_of_the_lyrics?: string | undefined | null,
	new_isrc_code?: boolean | undefined | null,
	isrc_code?: string | undefined | null,
	iswc_code?: string | undefined | null,
	artists?: Array<ResolverInputTypes["CollaboratorInput"]> | undefined | null,
	notes?: string | undefined | null
};
	["BasicSongOutput"]: AliasType<{
	id?:boolean | `@${string}`,
	duration?:boolean | `@${string}`,
	release_art?:boolean | `@${string}`,
	audio_path?:boolean | `@${string}`,
	title?:boolean | `@${string}`,
	artists?:ResolverInputTypes["ArtistOutput"],
		__typename?: boolean | `@${string}`
}>;
	["BasicSongInput"]: {
	id: string,
	title: string,
	duration: number,
	release_art: string,
	audio_path: string,
	artists: Array<ResolverInputTypes["ArtistInput"]>
};
	["OwnershipOutput"]: AliasType<{
	name?:boolean | `@${string}`,
	share?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["UserInput"]: {
	name?: string | undefined | null,
	locale?: string | undefined | null,
	nickname?: string | undefined | null,
	bio?: string | undefined | null,
	email?: string | undefined | null,
	preferred_username?: string | undefined | null,
	based_country?: string | undefined | null,
	based_region?: string | undefined | null,
	address?: string | undefined | null,
	website?: string | undefined | null,
	updated_at?: string | undefined | null,
	picture?: string | undefined | null,
	followers?: string | undefined | null,
	monthly_plays?: string | undefined | null,
	downloads?: string | undefined | null,
	is_artist?: boolean | undefined | null,
	country?: string | undefined | null,
	email_alerts?: string | undefined | null,
	instagram?: string | undefined | null,
	twitter?: string | undefined | null,
	youtube?: string | undefined | null,
	facebook?: string | undefined | null,
	role?: Array<string | undefined | null> | undefined | null,
	influencers?: Array<string | undefined | null> | undefined | null,
	genre?: Array<string | undefined | null> | undefined | null
};
	["UserOutput"]: AliasType<{
	sub?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	locale?:boolean | `@${string}`,
	nickname?:boolean | `@${string}`,
	bio?:boolean | `@${string}`,
	email?:boolean | `@${string}`,
	preferred_username?:boolean | `@${string}`,
	based_region?:boolean | `@${string}`,
	based_country?:boolean | `@${string}`,
	address?:boolean | `@${string}`,
	website?:boolean | `@${string}`,
	updated_at?:boolean | `@${string}`,
	picture?:boolean | `@${string}`,
	followers?:boolean | `@${string}`,
	monthly_plays?:boolean | `@${string}`,
	downloads?:boolean | `@${string}`,
	is_artist?:boolean | `@${string}`,
	country?:boolean | `@${string}`,
	email_alerts?:boolean | `@${string}`,
	instagram?:boolean | `@${string}`,
	twitter?:boolean | `@${string}`,
	youtube?:boolean | `@${string}`,
	facebook?:boolean | `@${string}`,
	role?:boolean | `@${string}`,
	influencers?:boolean | `@${string}`,
	genre?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PaginatedArtistInput"]: {
	artistId: string,
	nextToken?: string | undefined | null,
	pageSize?: number | undefined | null
};
	["PaginatedSongsOutput"]: AliasType<{
	nextToken?:boolean | `@${string}`,
	songs?:ResolverInputTypes["SongOutput"],
		__typename?: boolean | `@${string}`
}>;
	["IdentityInput"]: {
	request_upc?: boolean | undefined | null,
	upc?: string | undefined | null,
	request_ref_no?: boolean | undefined | null,
	reference_number?: string | undefined | null
};
	["IdentityOutput"]: AliasType<{
	request_upc?:boolean | `@${string}`,
	upc?:boolean | `@${string}`,
	request_ref_no?:boolean | `@${string}`,
	reference_number?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ReleaseInfoInput"]: {
	version?: string | undefined | null,
	title_language?: string | undefined | null,
	release_type?: ResolverInputTypes["ReleaseType"] | undefined | null,
	cover_art?: string | undefined | null,
	primary_genre?: string | undefined | null,
	secondary_genre?: string | undefined | null,
	artists?: Array<ResolverInputTypes["CollaboratorInput"] | undefined | null> | undefined | null,
	label: string,
	identity?: ResolverInputTypes["IdentityInput"] | undefined | null,
	release_description?: string | undefined | null
};
	["LicenceInput"]: {
	digital_release_date: string,
	original_release_date: string,
	licence_type: ResolverInputTypes["LicenceType"],
	legal_owner_of_work: ResolverInputTypes["ReleaseOwnerInput"],
	legal_owner_of_release: ResolverInputTypes["ReleaseOwnerInput"],
	price_category: ResolverInputTypes["PriceCategory"],
	excluded_territories?: Array<string | undefined | null> | undefined | null
};
	["ReleaseInput"]: {
	title: string,
	release_info: ResolverInputTypes["ReleaseInfoInput"],
	licence: ResolverInputTypes["LicenceInput"],
	distribution_platforms: Array<string>,
	status: ResolverInputTypes["ReleaseStatus"]
};
	["ReleaseUpdateInput"]: {
	id: string,
	title?: string | undefined | null,
	release_info?: ResolverInputTypes["ReleaseInfoInput"] | undefined | null,
	licence?: ResolverInputTypes["LicenceInput"] | undefined | null,
	distribution_platforms?: Array<string> | undefined | null,
	status?: ResolverInputTypes["ReleaseStatus"] | undefined | null
};
	["ReleaseInfoOutput"]: AliasType<{
	version?:boolean | `@${string}`,
	title_language?:boolean | `@${string}`,
	release_type?:boolean | `@${string}`,
	cover_art?:boolean | `@${string}`,
	primary_genre?:boolean | `@${string}`,
	secondary_genre?:boolean | `@${string}`,
	artists?:ResolverInputTypes["CollaboratorOutput"],
	label?:boolean | `@${string}`,
	identity?:ResolverInputTypes["IdentityOutput"],
	release_description?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["LicenceOutput"]: AliasType<{
	digital_release_date?:boolean | `@${string}`,
	original_release_date?:boolean | `@${string}`,
	licence_type?:boolean | `@${string}`,
	legal_owner_of_work?:ResolverInputTypes["ReleaseOwnerOutput"],
	legal_owner_of_release?:ResolverInputTypes["ReleaseOwnerOutput"],
	price_category?:boolean | `@${string}`,
	excluded_territories?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ReleaseOutput"]: AliasType<{
	id?:boolean | `@${string}`,
	title?:boolean | `@${string}`,
	release_info?:ResolverInputTypes["ReleaseInfoOutput"],
	licence?:ResolverInputTypes["LicenceOutput"],
	distribution_platforms?:boolean | `@${string}`,
	status?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["SongReleaseInput"]: {
	id: string,
	title: string
};
	["SongReleaseOutput"]: AliasType<{
	id?:boolean | `@${string}`,
	title?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ImgUploadResult"]: AliasType<{
	id?:boolean | `@${string}`,
	uploadURL?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ImageUploadUrlOutput"]: AliasType<{
	result?:ResolverInputTypes["ImgUploadResult"],
	result_info?:boolean | `@${string}`,
	success?:boolean | `@${string}`,
	errors?:boolean | `@${string}`,
	messages?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["SearchField"]:SearchField;
	["LatexSearchInput"]: {
	entity: ResolverInputTypes["SearchField"],
	username?: string | undefined | null,
	query?: string | undefined | null,
	size?: number | undefined | null,
	page?: number | undefined | null
};
	["SimpleSearchInput"]: {
	query?: string | undefined | null,
	size?: number | undefined | null,
	page?: number | undefined | null
};
	["AddVideoInput"]: {
	title: string,
	streamId: string,
	description?: string | undefined | null,
	thumbnail_ts?: number | undefined | null
};
	["SongSearchField"]: AliasType<{
	id?:boolean | `@${string}`,
	entity_type?:boolean | `@${string}`,
	artists?:boolean | `@${string}`,
	title?:boolean | `@${string}`,
	subtitle?:boolean | `@${string}`,
	lyrics?:boolean | `@${string}`,
	genre?:boolean | `@${string}`,
	publisher?:boolean | `@${string}`,
	release_art?:boolean | `@${string}`,
	audio_path?:boolean | `@${string}`,
	stream_count?:boolean | `@${string}`,
	duration?:boolean | `@${string}`,
	release_date?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ReleaseSearchField"]: AliasType<{
	id?:boolean | `@${string}`,
	entity_type?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	release_date?:boolean | `@${string}`,
	release_art?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["ArtistSearchField"]: AliasType<{
	id?:boolean | `@${string}`,
	entity_type?:boolean | `@${string}`,
	name?:boolean | `@${string}`,
	bio?:boolean | `@${string}`,
	role?:boolean | `@${string}`,
	picture?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["SearchResultFields"]: AliasType<{
	SongSearchField?:ResolverInputTypes["SongSearchField"],
	ReleaseSearchField?:ResolverInputTypes["ReleaseSearchField"],
	ArtistSearchField?:ResolverInputTypes["ArtistSearchField"],
		__typename?: boolean | `@${string}`
}>;
	["SearchHit"]: AliasType<{
	id?:boolean | `@${string}`,
	fields?:ResolverInputTypes["SearchResultFields"],
		__typename?: boolean | `@${string}`
}>;
	["SearchResult"]: AliasType<{
	found?:boolean | `@${string}`,
	start?:boolean | `@${string}`,
	hit?:ResolverInputTypes["SearchHit"],
		__typename?: boolean | `@${string}`
}>;
	["AllSearchHit"]: AliasType<{
	artist?:ResolverInputTypes["ArtistSearchField"],
	release?:ResolverInputTypes["ReleaseSearchField"],
	song?:ResolverInputTypes["SongSearchField"],
		__typename?: boolean | `@${string}`
}>;
	["AllSearchResult"]: AliasType<{
	found?:boolean | `@${string}`,
	start?:boolean | `@${string}`,
	hit?:ResolverInputTypes["AllSearchHit"],
		__typename?: boolean | `@${string}`
}>;
	["PaginatedReleasesOutput"]: AliasType<{
	releases?:ResolverInputTypes["ReleaseOutput"],
	nextToken?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PaginatedListArtistsOutput"]: AliasType<{
	artists?:ResolverInputTypes["UserOutput"],
	nextToken?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PaginatedBasicSongOutput"]: AliasType<{
	songs?:ResolverInputTypes["BasicSongOutput"],
	nextToken?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PaginatedSongIdsOutput"]: AliasType<{
	songs?:boolean | `@${string}`,
	nextToken?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PaginatedReleaseOutput"]: AliasType<{
	releases?:ResolverInputTypes["ReleaseOutput"],
	nextToken?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["TransactWriteOutput"]: AliasType<{
	message?:boolean | `@${string}`,
	id?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["GetCountriesOutput"]: AliasType<{
	countries?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["SuccessOutput"]: AliasType<{
	success?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["VideoOutput"]: AliasType<{
	id?:boolean | `@${string}`,
	title?:boolean | `@${string}`,
	streamId?:boolean | `@${string}`,
	description?:boolean | `@${string}`,
	thumbnail_ts?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["PaginatedVideosOutput"]: AliasType<{
	videos?:ResolverInputTypes["VideoOutput"],
	nextToken?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["GetVideoUploadUrlOutput"]: AliasType<{
	uploadUrl?:boolean | `@${string}`,
	streamId?:boolean | `@${string}`,
		__typename?: boolean | `@${string}`
}>;
	["Mutation"]: AliasType<{
putSong?: [{	input: ResolverInputTypes["SongInput"]},ResolverInputTypes["TransactWriteOutput"]],
updateSong?: [{	input: ResolverInputTypes["SongUpdateInput"]},ResolverInputTypes["TransactWriteOutput"]],
putRelease?: [{	input: ResolverInputTypes["ReleaseInput"]},ResolverInputTypes["ReleaseOutput"]],
updateRelease?: [{	input: ResolverInputTypes["ReleaseUpdateInput"]},ResolverInputTypes["ReleaseOutput"]],
deleteRelease?: [{	id: string},ResolverInputTypes["ReleaseOutput"]],
deleteSong?: [{	id: string},ResolverInputTypes["SongOutput"]],
addSongToRelease?: [{	songIds?: Array<string> | undefined | null,	releaseId: string},ResolverInputTypes["SuccessOutput"]],
deleteSongFromRelease?: [{	songIds?: Array<string> | undefined | null,	releaseId: string},ResolverInputTypes["SuccessOutput"]],
updateUser?: [{	input?: ResolverInputTypes["UserInput"] | undefined | null},ResolverInputTypes["UserOutput"]],
likeSong?: [{	songId: string,	artistId: string},ResolverInputTypes["TransactWriteOutput"]],
unlikeSong?: [{	songId: string,	artistId: string},ResolverInputTypes["TransactWriteOutput"]],
follow?: [{	userId: string},ResolverInputTypes["TransactWriteOutput"]],
unfollow?: [{	userId: string},ResolverInputTypes["TransactWriteOutput"]],
createImgUploadUrl?: [{	id?: string | undefined | null},ResolverInputTypes["ImageUploadUrlOutput"]],
addVideo?: [{	input?: ResolverInputTypes["AddVideoInput"] | undefined | null},ResolverInputTypes["VideoOutput"]],
deleteVideo?: [{	id: string},ResolverInputTypes["SuccessOutput"]],
		__typename?: boolean | `@${string}`
}>;
	["Query"]: AliasType<{
searchItem?: [{	input?: ResolverInputTypes["LatexSearchInput"] | undefined | null},ResolverInputTypes["SearchResult"]],
searchAll?: [{	input?: ResolverInputTypes["SimpleSearchInput"] | undefined | null},ResolverInputTypes["AllSearchResult"]],
getSongById?: [{	songId: string},ResolverInputTypes["SongOutput"]],
getAllSongs?: [{	nextToken?: string | undefined | null,	pageSize?: number | undefined | null},ResolverInputTypes["SongOutput"]],
getSongsByArtist?: [{	input: ResolverInputTypes["PaginatedArtistInput"]},ResolverInputTypes["PaginatedSongsOutput"]],
getSongsOfRelease?: [{	releaseId: string,	artistId: string},ResolverInputTypes["PaginatedSongsOutput"]],
getReleasesOfSong?: [{	songId: string,	pageSize?: number | undefined | null},ResolverInputTypes["PaginatedReleaseOutput"]],
getReleaseById?: [{	releaseId: string},ResolverInputTypes["ReleaseOutput"]],
getReleasesByArtist?: [{	input?: ResolverInputTypes["PaginatedArtistInput"] | undefined | null},ResolverInputTypes["PaginatedReleasesOutput"]],
	getUser?:ResolverInputTypes["UserOutput"],
getUserById?: [{	userId: string},ResolverInputTypes["UserOutput"]],
listArtists?: [{	nextToken?: string | undefined | null,	pageSize?: number | undefined | null},ResolverInputTypes["PaginatedListArtistsOutput"]],
getCountries?: [{	region: string},ResolverInputTypes["GetCountriesOutput"]],
getIsSongLiked?: [{	songId: string},boolean | `@${string}`],
getIsFollowed?: [{	userId: string},boolean | `@${string}`],
listLikedSongIds?: [{	nextToken?: string | undefined | null,	pageSize?: number | undefined | null},ResolverInputTypes["PaginatedSongIdsOutput"]],
getVideoUploadUrl?: [{	bytes: number},ResolverInputTypes["GetVideoUploadUrlOutput"]],
listAllVideosByArtist?: [{	input: ResolverInputTypes["ListEntityByArtistInput"]},ResolverInputTypes["PaginatedVideosOutput"]],
getVideo?: [{	id?: string | undefined | null},ResolverInputTypes["VideoOutput"]],
		__typename?: boolean | `@${string}`
}>;
	["schema"]: AliasType<{
	query?:ResolverInputTypes["Query"],
	mutation?:ResolverInputTypes["Mutation"],
		__typename?: boolean | `@${string}`
}>
  }

export type ModelTypes = {
    ["ArtistInput"]: {
	id: string,
	name: string,
	ownership: number
};
	["CollaboratorInput"]: {
	name: string,
	role: string,
	ownership: number
};
	["CollaboratorOutput"]: {
		name?: string | undefined,
	role?: string | undefined,
	ownership?: number | undefined
};
	["ExplicitLyrics"]:ExplicitLyrics;
	["ReleaseStatus"]:ReleaseStatus;
	["ReleaseType"]:ReleaseType;
	["LicenceType"]:LicenceType;
	["PriceCategory"]:PriceCategory;
	["ArtworkCopyrightInput"]: {
	name?: string | undefined,
	year?: number | undefined
};
	["ArtworkCopyrightOutput"]: {
		name?: string | undefined,
	year?: number | undefined
};
	["ReleaseOwnerInput"]: {
	name?: string | undefined,
	year?: number | undefined
};
	["ReleaseOwnerOutput"]: {
		name?: string | undefined,
	year?: number | undefined
};
	["SongInput"]: {
	audio_path: string,
	album_art?: string | undefined,
	title: string,
	duration: number,
	lyrics?: string | undefined,
	explicit_lyrics?: ModelTypes["ExplicitLyrics"] | undefined,
	licence_type: ModelTypes["LicenceType"],
	legal_owner_of_release: ModelTypes["ReleaseOwnerInput"],
	primary_genre: string,
	secondary_genre?: string | undefined,
	remix_or_version?: string | undefined,
	available_separately?: boolean | undefined,
	is_instrumental?: boolean | undefined,
	language_of_the_lyrics?: string | undefined,
	secondary_language_of_the_lyrics?: string | undefined,
	new_isrc_code?: boolean | undefined,
	isrc_code?: string | undefined,
	iswc_code?: string | undefined,
	artists: Array<ModelTypes["CollaboratorInput"]>,
	notes?: string | undefined
};
	["SongStatus"]:SongStatus;
	["SongOutput"]: {
		id?: string | undefined,
	audio_path?: string | undefined,
	album_art?: string | undefined,
	title?: string | undefined,
	duration?: number | undefined,
	lyrics?: string | undefined,
	explicit_lyrics?: ModelTypes["ExplicitLyrics"] | undefined,
	licence_type?: ModelTypes["LicenceType"] | undefined,
	legal_owner_of_release?: ModelTypes["ReleaseOwnerOutput"] | undefined,
	primary_genre?: string | undefined,
	secondary_genre?: string | undefined,
	remix_or_version?: string | undefined,
	available_separately?: boolean | undefined,
	is_instrumental?: boolean | undefined,
	language_of_the_lyrics?: string | undefined,
	secondary_language_of_the_lyrics?: string | undefined,
	new_isrc_code?: boolean | undefined,
	isrc_code?: string | undefined,
	iswc_code?: string | undefined,
	artists?: Array<ModelTypes["CollaboratorOutput"] | undefined> | undefined,
	notes?: string | undefined
};
	["ListEntityByArtistInput"]: {
	artistId: string,
	nextToken?: string | undefined,
	pageSize?: number | undefined
};
	["ArtistOutput"]: {
		id: string,
	name: string
};
	["SongUpdateInput"]: {
	id: string,
	title?: string | undefined,
	album_art?: string | undefined,
	lyrics?: string | undefined,
	explicit_lyrics?: ModelTypes["ExplicitLyrics"] | undefined,
	licence_type?: ModelTypes["LicenceType"] | undefined,
	legal_owner_of_release?: ModelTypes["ReleaseOwnerInput"] | undefined,
	primary_genre?: string | undefined,
	secondary_genre?: string | undefined,
	remix_or_version?: string | undefined,
	available_separately?: boolean | undefined,
	is_instrumental?: boolean | undefined,
	language_of_the_lyrics?: string | undefined,
	secondary_language_of_the_lyrics?: string | undefined,
	new_isrc_code?: boolean | undefined,
	isrc_code?: string | undefined,
	iswc_code?: string | undefined,
	artists?: Array<ModelTypes["CollaboratorInput"]> | undefined,
	notes?: string | undefined
};
	["BasicSongOutput"]: {
		id?: string | undefined,
	duration?: number | undefined,
	release_art?: string | undefined,
	audio_path?: string | undefined,
	title?: string | undefined,
	artists?: Array<ModelTypes["ArtistOutput"] | undefined> | undefined
};
	["BasicSongInput"]: {
	id: string,
	title: string,
	duration: number,
	release_art: string,
	audio_path: string,
	artists: Array<ModelTypes["ArtistInput"]>
};
	["OwnershipOutput"]: {
		name: string,
	share: number
};
	["UserInput"]: {
	name?: string | undefined,
	locale?: string | undefined,
	nickname?: string | undefined,
	bio?: string | undefined,
	email?: string | undefined,
	preferred_username?: string | undefined,
	based_country?: string | undefined,
	based_region?: string | undefined,
	address?: string | undefined,
	website?: string | undefined,
	updated_at?: string | undefined,
	picture?: string | undefined,
	followers?: string | undefined,
	monthly_plays?: string | undefined,
	downloads?: string | undefined,
	is_artist?: boolean | undefined,
	country?: string | undefined,
	email_alerts?: string | undefined,
	instagram?: string | undefined,
	twitter?: string | undefined,
	youtube?: string | undefined,
	facebook?: string | undefined,
	role?: Array<string | undefined> | undefined,
	influencers?: Array<string | undefined> | undefined,
	genre?: Array<string | undefined> | undefined
};
	["UserOutput"]: {
		sub?: string | undefined,
	name?: string | undefined,
	locale?: string | undefined,
	nickname?: string | undefined,
	bio?: string | undefined,
	email?: string | undefined,
	preferred_username?: string | undefined,
	based_region?: string | undefined,
	based_country?: string | undefined,
	address?: string | undefined,
	website?: string | undefined,
	updated_at?: string | undefined,
	picture?: string | undefined,
	followers?: string | undefined,
	monthly_plays?: string | undefined,
	downloads?: string | undefined,
	is_artist?: boolean | undefined,
	country?: string | undefined,
	email_alerts?: string | undefined,
	instagram?: string | undefined,
	twitter?: string | undefined,
	youtube?: string | undefined,
	facebook?: string | undefined,
	role?: Array<string | undefined> | undefined,
	influencers?: Array<string | undefined> | undefined,
	genre?: Array<string | undefined> | undefined
};
	["PaginatedArtistInput"]: {
	artistId: string,
	nextToken?: string | undefined,
	pageSize?: number | undefined
};
	["PaginatedSongsOutput"]: {
		nextToken?: string | undefined,
	songs?: Array<ModelTypes["SongOutput"] | undefined> | undefined
};
	["IdentityInput"]: {
	request_upc?: boolean | undefined,
	upc?: string | undefined,
	request_ref_no?: boolean | undefined,
	reference_number?: string | undefined
};
	["IdentityOutput"]: {
		request_upc?: boolean | undefined,
	upc?: string | undefined,
	request_ref_no?: boolean | undefined,
	reference_number?: string | undefined
};
	["ReleaseInfoInput"]: {
	version?: string | undefined,
	title_language?: string | undefined,
	release_type?: ModelTypes["ReleaseType"] | undefined,
	cover_art?: string | undefined,
	primary_genre?: string | undefined,
	secondary_genre?: string | undefined,
	artists?: Array<ModelTypes["CollaboratorInput"] | undefined> | undefined,
	label: string,
	identity?: ModelTypes["IdentityInput"] | undefined,
	release_description?: string | undefined
};
	["LicenceInput"]: {
	digital_release_date: string,
	original_release_date: string,
	licence_type: ModelTypes["LicenceType"],
	legal_owner_of_work: ModelTypes["ReleaseOwnerInput"],
	legal_owner_of_release: ModelTypes["ReleaseOwnerInput"],
	price_category: ModelTypes["PriceCategory"],
	excluded_territories?: Array<string | undefined> | undefined
};
	["ReleaseInput"]: {
	title: string,
	release_info: ModelTypes["ReleaseInfoInput"],
	licence: ModelTypes["LicenceInput"],
	distribution_platforms: Array<string>,
	status: ModelTypes["ReleaseStatus"]
};
	["ReleaseUpdateInput"]: {
	id: string,
	title?: string | undefined,
	release_info?: ModelTypes["ReleaseInfoInput"] | undefined,
	licence?: ModelTypes["LicenceInput"] | undefined,
	distribution_platforms?: Array<string> | undefined,
	status?: ModelTypes["ReleaseStatus"] | undefined
};
	["ReleaseInfoOutput"]: {
		version?: string | undefined,
	title_language?: string | undefined,
	release_type?: ModelTypes["ReleaseType"] | undefined,
	cover_art?: string | undefined,
	primary_genre?: string | undefined,
	secondary_genre?: string | undefined,
	artists?: Array<ModelTypes["CollaboratorOutput"] | undefined> | undefined,
	label?: string | undefined,
	identity?: ModelTypes["IdentityOutput"] | undefined,
	release_description?: string | undefined
};
	["LicenceOutput"]: {
		digital_release_date?: string | undefined,
	original_release_date?: string | undefined,
	licence_type?: ModelTypes["LicenceType"] | undefined,
	legal_owner_of_work?: ModelTypes["ReleaseOwnerOutput"] | undefined,
	legal_owner_of_release?: ModelTypes["ReleaseOwnerOutput"] | undefined,
	price_category?: ModelTypes["PriceCategory"] | undefined,
	excluded_territories?: Array<string | undefined> | undefined
};
	["ReleaseOutput"]: {
		id?: string | undefined,
	title?: string | undefined,
	release_info?: ModelTypes["ReleaseInfoOutput"] | undefined,
	licence?: ModelTypes["LicenceOutput"] | undefined,
	distribution_platforms?: Array<string | undefined> | undefined,
	status?: ModelTypes["ReleaseStatus"] | undefined
};
	["SongReleaseInput"]: {
	id: string,
	title: string
};
	["SongReleaseOutput"]: {
		id: string,
	title: string
};
	["ImgUploadResult"]: {
		id?: string | undefined,
	uploadURL?: string | undefined
};
	["ImageUploadUrlOutput"]: {
		result?: ModelTypes["ImgUploadResult"] | undefined,
	result_info?: string | undefined,
	success?: boolean | undefined,
	errors?: string | undefined,
	messages?: string | undefined
};
	["SearchField"]:SearchField;
	["LatexSearchInput"]: {
	entity: ModelTypes["SearchField"],
	username?: string | undefined,
	query?: string | undefined,
	size?: number | undefined,
	page?: number | undefined
};
	["SimpleSearchInput"]: {
	query?: string | undefined,
	size?: number | undefined,
	page?: number | undefined
};
	["AddVideoInput"]: {
	title: string,
	streamId: string,
	description?: string | undefined,
	thumbnail_ts?: number | undefined
};
	["SongSearchField"]: {
		id?: string | undefined,
	entity_type?: ModelTypes["SearchField"] | undefined,
	artists?: Array<string | undefined> | undefined,
	title?: string | undefined,
	subtitle?: string | undefined,
	lyrics?: string | undefined,
	genre?: string | undefined,
	publisher?: string | undefined,
	release_art?: string | undefined,
	audio_path?: string | undefined,
	stream_count?: number | undefined,
	duration?: number | undefined,
	release_date?: string | undefined
};
	["ReleaseSearchField"]: {
		id?: string | undefined,
	entity_type?: ModelTypes["SearchField"] | undefined,
	name?: string | undefined,
	release_date?: string | undefined,
	release_art?: string | undefined
};
	["ArtistSearchField"]: {
		id?: string | undefined,
	entity_type?: ModelTypes["SearchField"] | undefined,
	name?: string | undefined,
	bio?: string | undefined,
	role?: Array<string | undefined> | undefined,
	picture?: string | undefined
};
	["SearchResultFields"]:ModelTypes["SongSearchField"] | ModelTypes["ReleaseSearchField"] | ModelTypes["ArtistSearchField"];
	["SearchHit"]: {
		id?: string | undefined,
	fields?: ModelTypes["SearchResultFields"] | undefined
};
	["SearchResult"]: {
		found?: number | undefined,
	start?: number | undefined,
	hit?: Array<ModelTypes["SearchHit"] | undefined> | undefined
};
	["AllSearchHit"]: {
		artist?: Array<ModelTypes["ArtistSearchField"] | undefined> | undefined,
	release?: Array<ModelTypes["ReleaseSearchField"] | undefined> | undefined,
	song?: Array<ModelTypes["SongSearchField"] | undefined> | undefined
};
	["AllSearchResult"]: {
		found?: number | undefined,
	start?: number | undefined,
	hit?: ModelTypes["AllSearchHit"] | undefined
};
	["PaginatedReleasesOutput"]: {
		releases?: Array<ModelTypes["ReleaseOutput"] | undefined> | undefined,
	nextToken?: string | undefined
};
	["PaginatedListArtistsOutput"]: {
		artists?: Array<ModelTypes["UserOutput"] | undefined> | undefined,
	nextToken?: string | undefined
};
	["PaginatedBasicSongOutput"]: {
		songs?: Array<ModelTypes["BasicSongOutput"] | undefined> | undefined,
	nextToken?: string | undefined
};
	["PaginatedSongIdsOutput"]: {
		songs?: Array<string | undefined> | undefined,
	nextToken?: string | undefined
};
	["PaginatedReleaseOutput"]: {
		releases?: Array<ModelTypes["ReleaseOutput"] | undefined> | undefined,
	nextToken?: string | undefined
};
	["TransactWriteOutput"]: {
		message?: string | undefined,
	id?: string | undefined
};
	["GetCountriesOutput"]: {
		countries?: Array<string | undefined> | undefined
};
	["SuccessOutput"]: {
		success?: boolean | undefined
};
	["VideoOutput"]: {
		id?: string | undefined,
	title?: string | undefined,
	streamId?: string | undefined,
	description?: string | undefined,
	thumbnail_ts?: number | undefined
};
	["PaginatedVideosOutput"]: {
		videos?: Array<ModelTypes["VideoOutput"] | undefined> | undefined,
	nextToken?: string | undefined
};
	["GetVideoUploadUrlOutput"]: {
		uploadUrl?: string | undefined,
	streamId?: string | undefined
};
	["Mutation"]: {
		putSong?: ModelTypes["TransactWriteOutput"] | undefined,
	updateSong?: ModelTypes["TransactWriteOutput"] | undefined,
	putRelease?: ModelTypes["ReleaseOutput"] | undefined,
	updateRelease?: ModelTypes["ReleaseOutput"] | undefined,
	deleteRelease?: ModelTypes["ReleaseOutput"] | undefined,
	deleteSong?: ModelTypes["SongOutput"] | undefined,
	addSongToRelease?: ModelTypes["SuccessOutput"] | undefined,
	deleteSongFromRelease?: ModelTypes["SuccessOutput"] | undefined,
	updateUser?: ModelTypes["UserOutput"] | undefined,
	likeSong?: ModelTypes["TransactWriteOutput"] | undefined,
	unlikeSong?: ModelTypes["TransactWriteOutput"] | undefined,
	follow?: ModelTypes["TransactWriteOutput"] | undefined,
	unfollow?: ModelTypes["TransactWriteOutput"] | undefined,
	createImgUploadUrl?: ModelTypes["ImageUploadUrlOutput"] | undefined,
	addVideo?: ModelTypes["VideoOutput"] | undefined,
	deleteVideo?: ModelTypes["SuccessOutput"] | undefined
};
	["Query"]: {
		searchItem?: ModelTypes["SearchResult"] | undefined,
	searchAll?: ModelTypes["AllSearchResult"] | undefined,
	getSongById?: ModelTypes["SongOutput"] | undefined,
	getAllSongs?: ModelTypes["SongOutput"] | undefined,
	getSongsByArtist?: ModelTypes["PaginatedSongsOutput"] | undefined,
	getSongsOfRelease?: ModelTypes["PaginatedSongsOutput"] | undefined,
	getReleasesOfSong?: ModelTypes["PaginatedReleaseOutput"] | undefined,
	getReleaseById?: ModelTypes["ReleaseOutput"] | undefined,
	getReleasesByArtist?: ModelTypes["PaginatedReleasesOutput"] | undefined,
	getUser?: ModelTypes["UserOutput"] | undefined,
	getUserById?: ModelTypes["UserOutput"] | undefined,
	listArtists?: ModelTypes["PaginatedListArtistsOutput"] | undefined,
	getCountries?: ModelTypes["GetCountriesOutput"] | undefined,
	getIsSongLiked?: boolean | undefined,
	getIsFollowed?: boolean | undefined,
	listLikedSongIds?: ModelTypes["PaginatedSongIdsOutput"] | undefined,
	getVideoUploadUrl?: ModelTypes["GetVideoUploadUrlOutput"] | undefined,
	listAllVideosByArtist?: ModelTypes["PaginatedVideosOutput"] | undefined,
	getVideo?: ModelTypes["VideoOutput"] | undefined
};
	["schema"]: {
	query?: ModelTypes["Query"] | undefined,
	mutation?: ModelTypes["Mutation"] | undefined
}
    }

export type GraphQLTypes = {
    // Artist input schema;
	// default pageSize = 20;
	// basic info of song which will be stored in release;
	// Artist user schema;
	// default pageSize = 10;
	// Schemas for Release/Release;
	// Schemas for Release/Release;
	// Schemas for Release & Song;
	// Schemas for image upload;
	// Schemas for search;
	// Providing username will limit the results to that user;
	// On empty query, result will output all items of entity;
	// Default page size is 10;
	// Offset the search result (pagination);
	// Default page size is 10;
	// Offset the search result (pagination);
	// date format - yyyy-mm-ddT00:00:00Z;
	// Paginated schemas;
	// add/remove songs in release;
	// Update user;
	// like and follow mutations;
	// video mutation;
	// release_song queries;
	// release queries;
	// User queries;
	// constants;
	// like and follow queries;
	// getAllLikedSongs(nextToken: String): PaginatedSongsOutput;
	// video queries;
	["ArtistInput"]: {
		id: string,
	name: string,
	ownership: number
};
	["CollaboratorInput"]: {
		name: string,
	role: string,
	ownership: number
};
	["CollaboratorOutput"]: {
	__typename: "CollaboratorOutput",
	name?: string | undefined,
	role?: string | undefined,
	ownership?: number | undefined
};
	["ExplicitLyrics"]: ExplicitLyrics;
	["ReleaseStatus"]: ReleaseStatus;
	["ReleaseType"]: ReleaseType;
	["LicenceType"]: LicenceType;
	["PriceCategory"]: PriceCategory;
	["ArtworkCopyrightInput"]: {
		name?: string | undefined,
	year?: number | undefined
};
	["ArtworkCopyrightOutput"]: {
	__typename: "ArtworkCopyrightOutput",
	name?: string | undefined,
	year?: number | undefined
};
	["ReleaseOwnerInput"]: {
		name?: string | undefined,
	year?: number | undefined
};
	["ReleaseOwnerOutput"]: {
	__typename: "ReleaseOwnerOutput",
	name?: string | undefined,
	year?: number | undefined
};
	["SongInput"]: {
		audio_path: string,
	album_art?: string | undefined,
	title: string,
	duration: number,
	lyrics?: string | undefined,
	explicit_lyrics?: GraphQLTypes["ExplicitLyrics"] | undefined,
	licence_type: GraphQLTypes["LicenceType"],
	legal_owner_of_release: GraphQLTypes["ReleaseOwnerInput"],
	primary_genre: string,
	secondary_genre?: string | undefined,
	remix_or_version?: string | undefined,
	available_separately?: boolean | undefined,
	is_instrumental?: boolean | undefined,
	language_of_the_lyrics?: string | undefined,
	secondary_language_of_the_lyrics?: string | undefined,
	new_isrc_code?: boolean | undefined,
	isrc_code?: string | undefined,
	iswc_code?: string | undefined,
	artists: Array<GraphQLTypes["CollaboratorInput"]>,
	notes?: string | undefined
};
	["SongStatus"]: SongStatus;
	["SongOutput"]: {
	__typename: "SongOutput",
	id?: string | undefined,
	audio_path?: string | undefined,
	album_art?: string | undefined,
	title?: string | undefined,
	duration?: number | undefined,
	lyrics?: string | undefined,
	explicit_lyrics?: GraphQLTypes["ExplicitLyrics"] | undefined,
	licence_type?: GraphQLTypes["LicenceType"] | undefined,
	legal_owner_of_release?: GraphQLTypes["ReleaseOwnerOutput"] | undefined,
	primary_genre?: string | undefined,
	secondary_genre?: string | undefined,
	remix_or_version?: string | undefined,
	available_separately?: boolean | undefined,
	is_instrumental?: boolean | undefined,
	language_of_the_lyrics?: string | undefined,
	secondary_language_of_the_lyrics?: string | undefined,
	new_isrc_code?: boolean | undefined,
	isrc_code?: string | undefined,
	iswc_code?: string | undefined,
	artists?: Array<GraphQLTypes["CollaboratorOutput"] | undefined> | undefined,
	notes?: string | undefined
};
	["ListEntityByArtistInput"]: {
		artistId: string,
	nextToken?: string | undefined,
	pageSize?: number | undefined
};
	["ArtistOutput"]: {
	__typename: "ArtistOutput",
	id: string,
	name: string
};
	["SongUpdateInput"]: {
		id: string,
	title?: string | undefined,
	album_art?: string | undefined,
	lyrics?: string | undefined,
	explicit_lyrics?: GraphQLTypes["ExplicitLyrics"] | undefined,
	licence_type?: GraphQLTypes["LicenceType"] | undefined,
	legal_owner_of_release?: GraphQLTypes["ReleaseOwnerInput"] | undefined,
	primary_genre?: string | undefined,
	secondary_genre?: string | undefined,
	remix_or_version?: string | undefined,
	available_separately?: boolean | undefined,
	is_instrumental?: boolean | undefined,
	language_of_the_lyrics?: string | undefined,
	secondary_language_of_the_lyrics?: string | undefined,
	new_isrc_code?: boolean | undefined,
	isrc_code?: string | undefined,
	iswc_code?: string | undefined,
	artists?: Array<GraphQLTypes["CollaboratorInput"]> | undefined,
	notes?: string | undefined
};
	["BasicSongOutput"]: {
	__typename: "BasicSongOutput",
	id?: string | undefined,
	duration?: number | undefined,
	release_art?: string | undefined,
	audio_path?: string | undefined,
	title?: string | undefined,
	artists?: Array<GraphQLTypes["ArtistOutput"] | undefined> | undefined
};
	["BasicSongInput"]: {
		id: string,
	title: string,
	duration: number,
	release_art: string,
	audio_path: string,
	artists: Array<GraphQLTypes["ArtistInput"]>
};
	["OwnershipOutput"]: {
	__typename: "OwnershipOutput",
	name: string,
	share: number
};
	["UserInput"]: {
		name?: string | undefined,
	locale?: string | undefined,
	nickname?: string | undefined,
	bio?: string | undefined,
	email?: string | undefined,
	preferred_username?: string | undefined,
	based_country?: string | undefined,
	based_region?: string | undefined,
	address?: string | undefined,
	website?: string | undefined,
	updated_at?: string | undefined,
	picture?: string | undefined,
	followers?: string | undefined,
	monthly_plays?: string | undefined,
	downloads?: string | undefined,
	is_artist?: boolean | undefined,
	country?: string | undefined,
	email_alerts?: string | undefined,
	instagram?: string | undefined,
	twitter?: string | undefined,
	youtube?: string | undefined,
	facebook?: string | undefined,
	role?: Array<string | undefined> | undefined,
	influencers?: Array<string | undefined> | undefined,
	genre?: Array<string | undefined> | undefined
};
	["UserOutput"]: {
	__typename: "UserOutput",
	sub?: string | undefined,
	name?: string | undefined,
	locale?: string | undefined,
	nickname?: string | undefined,
	bio?: string | undefined,
	email?: string | undefined,
	preferred_username?: string | undefined,
	based_region?: string | undefined,
	based_country?: string | undefined,
	address?: string | undefined,
	website?: string | undefined,
	updated_at?: string | undefined,
	picture?: string | undefined,
	followers?: string | undefined,
	monthly_plays?: string | undefined,
	downloads?: string | undefined,
	is_artist?: boolean | undefined,
	country?: string | undefined,
	email_alerts?: string | undefined,
	instagram?: string | undefined,
	twitter?: string | undefined,
	youtube?: string | undefined,
	facebook?: string | undefined,
	role?: Array<string | undefined> | undefined,
	influencers?: Array<string | undefined> | undefined,
	genre?: Array<string | undefined> | undefined
};
	["PaginatedArtistInput"]: {
		artistId: string,
	nextToken?: string | undefined,
	pageSize?: number | undefined
};
	["PaginatedSongsOutput"]: {
	__typename: "PaginatedSongsOutput",
	nextToken?: string | undefined,
	songs?: Array<GraphQLTypes["SongOutput"] | undefined> | undefined
};
	["IdentityInput"]: {
		request_upc?: boolean | undefined,
	upc?: string | undefined,
	request_ref_no?: boolean | undefined,
	reference_number?: string | undefined
};
	["IdentityOutput"]: {
	__typename: "IdentityOutput",
	request_upc?: boolean | undefined,
	upc?: string | undefined,
	request_ref_no?: boolean | undefined,
	reference_number?: string | undefined
};
	["ReleaseInfoInput"]: {
		version?: string | undefined,
	title_language?: string | undefined,
	release_type?: GraphQLTypes["ReleaseType"] | undefined,
	cover_art?: string | undefined,
	primary_genre?: string | undefined,
	secondary_genre?: string | undefined,
	artists?: Array<GraphQLTypes["CollaboratorInput"] | undefined> | undefined,
	label: string,
	identity?: GraphQLTypes["IdentityInput"] | undefined,
	release_description?: string | undefined
};
	["LicenceInput"]: {
		digital_release_date: string,
	original_release_date: string,
	licence_type: GraphQLTypes["LicenceType"],
	legal_owner_of_work: GraphQLTypes["ReleaseOwnerInput"],
	legal_owner_of_release: GraphQLTypes["ReleaseOwnerInput"],
	price_category: GraphQLTypes["PriceCategory"],
	excluded_territories?: Array<string | undefined> | undefined
};
	["ReleaseInput"]: {
		title: string,
	release_info: GraphQLTypes["ReleaseInfoInput"],
	licence: GraphQLTypes["LicenceInput"],
	distribution_platforms: Array<string>,
	status: GraphQLTypes["ReleaseStatus"]
};
	["ReleaseUpdateInput"]: {
		id: string,
	title?: string | undefined,
	release_info?: GraphQLTypes["ReleaseInfoInput"] | undefined,
	licence?: GraphQLTypes["LicenceInput"] | undefined,
	distribution_platforms?: Array<string> | undefined,
	status?: GraphQLTypes["ReleaseStatus"] | undefined
};
	["ReleaseInfoOutput"]: {
	__typename: "ReleaseInfoOutput",
	version?: string | undefined,
	title_language?: string | undefined,
	release_type?: GraphQLTypes["ReleaseType"] | undefined,
	cover_art?: string | undefined,
	primary_genre?: string | undefined,
	secondary_genre?: string | undefined,
	artists?: Array<GraphQLTypes["CollaboratorOutput"] | undefined> | undefined,
	label?: string | undefined,
	identity?: GraphQLTypes["IdentityOutput"] | undefined,
	release_description?: string | undefined
};
	["LicenceOutput"]: {
	__typename: "LicenceOutput",
	digital_release_date?: string | undefined,
	original_release_date?: string | undefined,
	licence_type?: GraphQLTypes["LicenceType"] | undefined,
	legal_owner_of_work?: GraphQLTypes["ReleaseOwnerOutput"] | undefined,
	legal_owner_of_release?: GraphQLTypes["ReleaseOwnerOutput"] | undefined,
	price_category?: GraphQLTypes["PriceCategory"] | undefined,
	excluded_territories?: Array<string | undefined> | undefined
};
	["ReleaseOutput"]: {
	__typename: "ReleaseOutput",
	id?: string | undefined,
	title?: string | undefined,
	release_info?: GraphQLTypes["ReleaseInfoOutput"] | undefined,
	licence?: GraphQLTypes["LicenceOutput"] | undefined,
	distribution_platforms?: Array<string | undefined> | undefined,
	status?: GraphQLTypes["ReleaseStatus"] | undefined
};
	["SongReleaseInput"]: {
		id: string,
	title: string
};
	["SongReleaseOutput"]: {
	__typename: "SongReleaseOutput",
	id: string,
	title: string
};
	["ImgUploadResult"]: {
	__typename: "ImgUploadResult",
	id?: string | undefined,
	uploadURL?: string | undefined
};
	["ImageUploadUrlOutput"]: {
	__typename: "ImageUploadUrlOutput",
	result?: GraphQLTypes["ImgUploadResult"] | undefined,
	result_info?: string | undefined,
	success?: boolean | undefined,
	errors?: string | undefined,
	messages?: string | undefined
};
	["SearchField"]: SearchField;
	["LatexSearchInput"]: {
		entity: GraphQLTypes["SearchField"],
	username?: string | undefined,
	query?: string | undefined,
	size?: number | undefined,
	page?: number | undefined
};
	["SimpleSearchInput"]: {
		query?: string | undefined,
	size?: number | undefined,
	page?: number | undefined
};
	["AddVideoInput"]: {
		title: string,
	streamId: string,
	description?: string | undefined,
	thumbnail_ts?: number | undefined
};
	["SongSearchField"]: {
	__typename: "SongSearchField",
	id?: string | undefined,
	entity_type?: GraphQLTypes["SearchField"] | undefined,
	artists?: Array<string | undefined> | undefined,
	title?: string | undefined,
	subtitle?: string | undefined,
	lyrics?: string | undefined,
	genre?: string | undefined,
	publisher?: string | undefined,
	release_art?: string | undefined,
	audio_path?: string | undefined,
	stream_count?: number | undefined,
	duration?: number | undefined,
	release_date?: string | undefined
};
	["ReleaseSearchField"]: {
	__typename: "ReleaseSearchField",
	id?: string | undefined,
	entity_type?: GraphQLTypes["SearchField"] | undefined,
	name?: string | undefined,
	release_date?: string | undefined,
	release_art?: string | undefined
};
	["ArtistSearchField"]: {
	__typename: "ArtistSearchField",
	id?: string | undefined,
	entity_type?: GraphQLTypes["SearchField"] | undefined,
	name?: string | undefined,
	bio?: string | undefined,
	role?: Array<string | undefined> | undefined,
	picture?: string | undefined
};
	["SearchResultFields"]:{
        	__typename:"SongSearchField" | "ReleaseSearchField" | "ArtistSearchField"
        	['...on SongSearchField']: '__union' & GraphQLTypes["SongSearchField"];
	['...on ReleaseSearchField']: '__union' & GraphQLTypes["ReleaseSearchField"];
	['...on ArtistSearchField']: '__union' & GraphQLTypes["ArtistSearchField"];
};
	["SearchHit"]: {
	__typename: "SearchHit",
	id?: string | undefined,
	fields?: GraphQLTypes["SearchResultFields"] | undefined
};
	["SearchResult"]: {
	__typename: "SearchResult",
	found?: number | undefined,
	start?: number | undefined,
	hit?: Array<GraphQLTypes["SearchHit"] | undefined> | undefined
};
	["AllSearchHit"]: {
	__typename: "AllSearchHit",
	artist?: Array<GraphQLTypes["ArtistSearchField"] | undefined> | undefined,
	release?: Array<GraphQLTypes["ReleaseSearchField"] | undefined> | undefined,
	song?: Array<GraphQLTypes["SongSearchField"] | undefined> | undefined
};
	["AllSearchResult"]: {
	__typename: "AllSearchResult",
	found?: number | undefined,
	start?: number | undefined,
	hit?: GraphQLTypes["AllSearchHit"] | undefined
};
	["PaginatedReleasesOutput"]: {
	__typename: "PaginatedReleasesOutput",
	releases?: Array<GraphQLTypes["ReleaseOutput"] | undefined> | undefined,
	nextToken?: string | undefined
};
	["PaginatedListArtistsOutput"]: {
	__typename: "PaginatedListArtistsOutput",
	artists?: Array<GraphQLTypes["UserOutput"] | undefined> | undefined,
	nextToken?: string | undefined
};
	["PaginatedBasicSongOutput"]: {
	__typename: "PaginatedBasicSongOutput",
	songs?: Array<GraphQLTypes["BasicSongOutput"] | undefined> | undefined,
	nextToken?: string | undefined
};
	["PaginatedSongIdsOutput"]: {
	__typename: "PaginatedSongIdsOutput",
	songs?: Array<string | undefined> | undefined,
	nextToken?: string | undefined
};
	["PaginatedReleaseOutput"]: {
	__typename: "PaginatedReleaseOutput",
	releases?: Array<GraphQLTypes["ReleaseOutput"] | undefined> | undefined,
	nextToken?: string | undefined
};
	["TransactWriteOutput"]: {
	__typename: "TransactWriteOutput",
	message?: string | undefined,
	id?: string | undefined
};
	["GetCountriesOutput"]: {
	__typename: "GetCountriesOutput",
	countries?: Array<string | undefined> | undefined
};
	["SuccessOutput"]: {
	__typename: "SuccessOutput",
	success?: boolean | undefined
};
	["VideoOutput"]: {
	__typename: "VideoOutput",
	id?: string | undefined,
	title?: string | undefined,
	streamId?: string | undefined,
	description?: string | undefined,
	thumbnail_ts?: number | undefined
};
	["PaginatedVideosOutput"]: {
	__typename: "PaginatedVideosOutput",
	videos?: Array<GraphQLTypes["VideoOutput"] | undefined> | undefined,
	nextToken?: string | undefined
};
	["GetVideoUploadUrlOutput"]: {
	__typename: "GetVideoUploadUrlOutput",
	uploadUrl?: string | undefined,
	streamId?: string | undefined
};
	["Mutation"]: {
	__typename: "Mutation",
	putSong?: GraphQLTypes["TransactWriteOutput"] | undefined,
	updateSong?: GraphQLTypes["TransactWriteOutput"] | undefined,
	putRelease?: GraphQLTypes["ReleaseOutput"] | undefined,
	updateRelease?: GraphQLTypes["ReleaseOutput"] | undefined,
	deleteRelease?: GraphQLTypes["ReleaseOutput"] | undefined,
	deleteSong?: GraphQLTypes["SongOutput"] | undefined,
	addSongToRelease?: GraphQLTypes["SuccessOutput"] | undefined,
	deleteSongFromRelease?: GraphQLTypes["SuccessOutput"] | undefined,
	updateUser?: GraphQLTypes["UserOutput"] | undefined,
	likeSong?: GraphQLTypes["TransactWriteOutput"] | undefined,
	unlikeSong?: GraphQLTypes["TransactWriteOutput"] | undefined,
	follow?: GraphQLTypes["TransactWriteOutput"] | undefined,
	unfollow?: GraphQLTypes["TransactWriteOutput"] | undefined,
	createImgUploadUrl?: GraphQLTypes["ImageUploadUrlOutput"] | undefined,
	addVideo?: GraphQLTypes["VideoOutput"] | undefined,
	deleteVideo?: GraphQLTypes["SuccessOutput"] | undefined
};
	["Query"]: {
	__typename: "Query",
	searchItem?: GraphQLTypes["SearchResult"] | undefined,
	searchAll?: GraphQLTypes["AllSearchResult"] | undefined,
	getSongById?: GraphQLTypes["SongOutput"] | undefined,
	getAllSongs?: GraphQLTypes["SongOutput"] | undefined,
	getSongsByArtist?: GraphQLTypes["PaginatedSongsOutput"] | undefined,
	getSongsOfRelease?: GraphQLTypes["PaginatedSongsOutput"] | undefined,
	getReleasesOfSong?: GraphQLTypes["PaginatedReleaseOutput"] | undefined,
	getReleaseById?: GraphQLTypes["ReleaseOutput"] | undefined,
	getReleasesByArtist?: GraphQLTypes["PaginatedReleasesOutput"] | undefined,
	getUser?: GraphQLTypes["UserOutput"] | undefined,
	getUserById?: GraphQLTypes["UserOutput"] | undefined,
	listArtists?: GraphQLTypes["PaginatedListArtistsOutput"] | undefined,
	getCountries?: GraphQLTypes["GetCountriesOutput"] | undefined,
	getIsSongLiked?: boolean | undefined,
	getIsFollowed?: boolean | undefined,
	listLikedSongIds?: GraphQLTypes["PaginatedSongIdsOutput"] | undefined,
	getVideoUploadUrl?: GraphQLTypes["GetVideoUploadUrlOutput"] | undefined,
	listAllVideosByArtist?: GraphQLTypes["PaginatedVideosOutput"] | undefined,
	getVideo?: GraphQLTypes["VideoOutput"] | undefined
}
    }
export const enum ExplicitLyrics {
	NOT_EXPLICIT = "NOT_EXPLICIT",
	EXPLICIT = "EXPLICIT",
	CLEANED = "CLEANED"
}
export const enum ReleaseStatus {
	DRAFT = "DRAFT",
	SUBMITTED = "SUBMITTED",
	PUBLISHED = "PUBLISHED",
	REJECTED = "REJECTED",
	PENDING_UPDATE = "PENDING_UPDATE"
}
export const enum ReleaseType {
	SINGLE = "SINGLE",
	ALBUM = "ALBUM",
	EP = "EP",
	COMPILATION = "COMPILATION"
}
export const enum LicenceType {
	COPYRIGHT = "COPYRIGHT",
	CREATIVE_COMMONS = "CREATIVE_COMMONS"
}
export const enum PriceCategory {
	BUDGET = "BUDGET",
	MID = "MID",
	FULL = "FULL",
	PREMIUM = "PREMIUM"
}
export const enum SongStatus {
	PUBLISHED = "PUBLISHED",
	REJECTED = "REJECTED",
	DRAFT = "DRAFT"
}
export const enum SearchField {
	ARTIST = "ARTIST",
	SONG = "SONG",
	ALBUM = "ALBUM"
}

type ZEUS_VARIABLES = {
	["ArtistInput"]: ValueTypes["ArtistInput"];
	["CollaboratorInput"]: ValueTypes["CollaboratorInput"];
	["ExplicitLyrics"]: ValueTypes["ExplicitLyrics"];
	["ReleaseStatus"]: ValueTypes["ReleaseStatus"];
	["ReleaseType"]: ValueTypes["ReleaseType"];
	["LicenceType"]: ValueTypes["LicenceType"];
	["PriceCategory"]: ValueTypes["PriceCategory"];
	["ArtworkCopyrightInput"]: ValueTypes["ArtworkCopyrightInput"];
	["ReleaseOwnerInput"]: ValueTypes["ReleaseOwnerInput"];
	["SongInput"]: ValueTypes["SongInput"];
	["SongStatus"]: ValueTypes["SongStatus"];
	["ListEntityByArtistInput"]: ValueTypes["ListEntityByArtistInput"];
	["SongUpdateInput"]: ValueTypes["SongUpdateInput"];
	["BasicSongInput"]: ValueTypes["BasicSongInput"];
	["UserInput"]: ValueTypes["UserInput"];
	["PaginatedArtistInput"]: ValueTypes["PaginatedArtistInput"];
	["IdentityInput"]: ValueTypes["IdentityInput"];
	["ReleaseInfoInput"]: ValueTypes["ReleaseInfoInput"];
	["LicenceInput"]: ValueTypes["LicenceInput"];
	["ReleaseInput"]: ValueTypes["ReleaseInput"];
	["ReleaseUpdateInput"]: ValueTypes["ReleaseUpdateInput"];
	["SongReleaseInput"]: ValueTypes["SongReleaseInput"];
	["SearchField"]: ValueTypes["SearchField"];
	["LatexSearchInput"]: ValueTypes["LatexSearchInput"];
	["SimpleSearchInput"]: ValueTypes["SimpleSearchInput"];
	["AddVideoInput"]: ValueTypes["AddVideoInput"];
}