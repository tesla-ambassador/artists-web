export type ExpandTypes<T> = {
  [K in keyof T]: T[K]
} & {}