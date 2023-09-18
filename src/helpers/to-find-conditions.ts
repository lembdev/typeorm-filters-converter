import type { FindOptionsWhere, FindOperator } from 'typeorm';
import type { IFilter } from '../filters.types';
import {
  Between,
  Equal,
  ILike,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  IsNull,
} from 'typeorm';

const iterateFilter = <T>(
  filter: unknown,
): FindOperator<T> | Record<string, FindOperator<T>> | undefined => {
  if (!filter) return undefined;

  return Object.entries(filter as Record<string, unknown>).reduce(
    (acc, [comparator, value]) => {
      if (value === null) {
        return IsNull();
      }

      switch (comparator) {
        case 'eq':
          return Equal(value);
        case 'isNull':
          return IsNull();
        case 'isNotNull':
          return Not(IsNull());
        case 'notEq':
          return Not(value);
        case 'gt':
        case 'after':
          return MoreThan(value);
        case 'afterOrEq':
        case 'gte':
          return MoreThanOrEqual(value);
        case 'lt':
        case 'before':
          return LessThan(value);
        case 'beforeOrEq':
        case 'lte':
          return LessThanOrEqual(value);
        case 'between':
          return Between(
            (value as Record<string, unknown>).start,
            (value as Record<string, unknown>).end,
          );
        case 'contains':
          return ILike(`%${value}%`);
        case 'notContains':
          return Not(ILike(`%${value}%`));
        case 'startsWith':
          return ILike(`${value}%`);
        case 'notStartsWith':
          return Not(ILike(`${value}%`));
        case 'endsWith':
          return ILike(`%${value}`);
        case 'notEndsWith':
          return Not(ILike(`%${value}`));
        case 'in':
          return In(value as string[]);
        case 'notIn':
          return Not(In(value as string[]));
        default:
          if (typeof value === 'object') {
            return {
              ...acc,
              [comparator]: iterateFilter(value as IFilter<T>),
            };
          }
          throw new Error('Bad request');
      }
    },
    {},
  );
};

export const toFindConditions = <T>(
  filters: IFilter<T>,
): FindOptionsWhere<T> => {
  return Object.fromEntries(
    Object.entries(filters).map(([k, v]) => [k, iterateFilter<T>(v)]),
  ) as FindOptionsWhere<T>;
};
