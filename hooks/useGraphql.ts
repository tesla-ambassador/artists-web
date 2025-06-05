import { API, graphqlOperation } from "aws-amplify";
import { useEffect } from "react";
import { GraphQLTypes, InputType, ValueTypes, Zeus } from "@/zeus";
import { useImmer } from "use-immer";

export interface QueryOptions {
  fetchOnMount?: boolean;
}
export const useGraphqlQuery = <
  O extends "Query",
  TData extends ValueTypes[O],
  TResult = InputType<GraphQLTypes[O], TData>,
>(
  query: TData,
  options: QueryOptions = {
    fetchOnMount: true,
  },
) => {
  const [status, setStatus] = useImmer({
    data: {} as TResult,
    error: null,
    isLoading: false,
  });

  const fetchGql = async (_query?: TData) => {
    const gqlOp = graphqlOperation(Zeus("query", _query || query));
    try {
      setStatus((draft) => {
        draft.isLoading = true;
      });
      const res = (await API.graphql(gqlOp)) as { data?: TResult };
      setStatus((draft) => {
        if (!res.data) {
          throw new Error("No data returned from GraphQL query");
        }
        // @ts-ignore
        draft.data = res.data;
        draft.isLoading = false;
      });
      return res.data;
    } catch (err: any) {
      setStatus((draft) => {
        draft.error = err.message;
        draft.isLoading = false;
      });
      console.error(gqlOp);
      throw Error(err.message);
    }
  };

  useEffect(() => {
    if (!options.fetchOnMount) return;
    fetchGql();
  }, []);

  return { ...status, refetch: fetchGql };
};

export const useGraphqlMutation = () => {
  const [status, setStatus] = useImmer({
    data: {},
    error: null,
    isLoading: false,
  });

  const mutate = async <
    O extends "Mutation",
    TData extends ValueTypes[O],
    TResult = InputType<GraphQLTypes[O], TData>,
  >(
    mutation: TData | ValueTypes[O],
  ) => {
    try {
      setStatus((draft) => {
        draft.isLoading = true;
      });
      const gqlOp = graphqlOperation(Zeus("mutation", mutation));

      const res = (await API.graphql(gqlOp)) as { data?: TResult };
      setStatus((draft) => {
        draft.isLoading = false;
        // @ts-ignore
        draft.data = res.data;
      });
      return res;
    } catch (err: any) {
      setStatus((draft) => {
        draft.error = err.message;
        draft.isLoading = false;
      });
      throw Error(err.message);
    }
  };

  return { mutate, ...status };
};
