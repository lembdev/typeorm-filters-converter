import { IFilter } from '../filters.types';
import { toFindConditions } from './to-find-conditions';
import {
  Between,
  Equal,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

const date = new Date('2023-01-31 12:00:00');
const dateStart = new Date('2023-01-31 00:00:00.000');
const dateEnd = new Date('2023-01-31 23:59:59.999');

describe.each`
  operator                                           | expected
  ${{ eq: null }}                                    | ${{ name: IsNull() }}
  ${{ eq: 'test' }}                                  | ${{ name: Equal('test') }}
  ${{ eq: 123 }}                                     | ${{ name: Equal(123) }}
  ${{ eq: true }}                                    | ${{ name: Equal(true) }}
  ${{ eq: date }}                                    | ${{ name: Equal(date) }}
  ${{ isNull: true }}                                | ${{ name: IsNull() }}
  ${{ isNotNull: true }}                             | ${{ name: Not(IsNull()) }}
  ${{ notEq: 'test' }}                               | ${{ name: Not('test') }}
  ${{ notEq: 123 }}                                  | ${{ name: Not(123) }}
  ${{ notEq: true }}                                 | ${{ name: Not(true) }}
  ${{ gt: 123 }}                                     | ${{ name: MoreThan(123) }}
  ${{ gt: date }}                                    | ${{ name: MoreThan(date) }}
  ${{ after: 123 }}                                  | ${{ name: MoreThan(123) }}
  ${{ after: date }}                                 | ${{ name: MoreThan(date) }}
  ${{ gte: 123 }}                                    | ${{ name: MoreThanOrEqual(123) }}
  ${{ gte: date }}                                   | ${{ name: MoreThanOrEqual(date) }}
  ${{ afterOrEq: 123 }}                              | ${{ name: MoreThanOrEqual(123) }}
  ${{ afterOrEq: date }}                             | ${{ name: MoreThanOrEqual(date) }}
  ${{ lt: 123 }}                                     | ${{ name: LessThan(123) }}
  ${{ lt: date }}                                    | ${{ name: LessThan(date) }}
  ${{ before: 123 }}                                 | ${{ name: LessThan(123) }}
  ${{ before: date }}                                | ${{ name: LessThan(date) }}
  ${{ lte: 123 }}                                    | ${{ name: LessThanOrEqual(123) }}
  ${{ lte: date }}                                   | ${{ name: LessThanOrEqual(date) }}
  ${{ beforeOrEq: 123 }}                             | ${{ name: LessThanOrEqual(123) }}
  ${{ beforeOrEq: date }}                            | ${{ name: LessThanOrEqual(date) }}
  ${{ between: { start: 12, end: 33 } }}             | ${{ name: Between(12, 33) }}
  ${{ between: { start: dateStart, end: dateEnd } }} | ${{ name: Between(dateStart, dateEnd) }}
  ${{ contains: 'test' }}                            | ${{ name: ILike('%test%') }}
  ${{ notContains: 'test' }}                         | ${{ name: Not(ILike('%test%')) }}
  ${{ startsWith: 'test' }}                          | ${{ name: ILike('test%') }}
  ${{ notStartsWith: 'test' }}                       | ${{ name: Not(ILike('test%')) }}
  ${{ endsWith: 'test' }}                            | ${{ name: ILike('%test') }}
  ${{ notEndsWith: 'test' }}                         | ${{ name: Not(ILike('%test')) }}
  ${{ in: [2, 4, 7] }}                               | ${{ name: In([2, 4, 7]) }}
  ${{ in: ['a', 'b', 'c'] }}                         | ${{ name: In(['a', 'b', 'c']) }}
  ${{ notIn: [2, 4, 7] }}                            | ${{ name: Not(In([2, 4, 7])) }}
  ${{ notIn: ['a', 'b', 'c'] }}                      | ${{ name: Not(In(['a', 'b', 'c'])) }}
  ${{ nested: { eq: 'test' } }}                      | ${{ name: { nested: Equal('test') } }}
`('when filters: $operator', ({ operator, expected }) => {
  it(`should return ${expected}`, async () => {
    const filters = { name: operator };

    const result = toFindConditions(filters);

    expect(result).toEqual(expected);
  });
});

describe('when provided unknown filter operator', () => {
  it('should thorw Error', () => {
    const filters = { name: { aaa: 'test' } } as IFilter<{ name: string }>;

    const test = (): ReturnType<typeof toFindConditions> =>
      toFindConditions(filters);

    expect(test).toThrow('Bad request');
  });
});

describe('when filter operator is undefined', () => {
  it('should thorw Error', () => {
    const filters = { name: undefined } as IFilter<{ name: string }>;

    const result = toFindConditions(filters);

    expect(result).toEqual({ name: undefined });
  });
});
