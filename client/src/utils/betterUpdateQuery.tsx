import { QueryInput, Cache } from '@urql/exchange-graphcache';

export const betterUpdateQuery = <Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (res: Result, query: Query) => Query
) => {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
};
