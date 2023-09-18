import type { IOperator } from '../filters.types';
import { operatorToWhereString } from './operator-to-where-string';

const column = 'column';
const nestedColumn = 'nested';
const date = new Date('2023-01-31T12:00:00.000Z');
const dateStart = new Date('2023-03-31T12:00:00.000Z');
const dateEnd = new Date('2023-08-12T12:00:00.000Z');

describe.each`
  operator                                           | expected
  ${{ eq: 23 }}                                      | ${`"${column}" = '23'`}
  ${{ eq: date }}                                    | ${`"${column}" = '2023-01-31T12:00:00.000Z'`}
  ${{ notEq: 23 }}                                   | ${`"${column}" != '23'`}
  ${{ lt: 23 }}                                      | ${`"${column}" < '23'`}
  ${{ lt: date }}                                    | ${`"${column}" < '2023-01-31T12:00:00.000Z'`}
  ${{ before: 23 }}                                  | ${`"${column}" < '23'`}
  ${{ before: date }}                                | ${`"${column}" < '2023-01-31T12:00:00.000Z'`}
  ${{ lte: 23 }}                                     | ${`"${column}" <= '23'`}
  ${{ lte: date }}                                   | ${`"${column}" <= '2023-01-31T12:00:00.000Z'`}
  ${{ beforeOrEq: 23 }}                              | ${`"${column}" <= '23'`}
  ${{ beforeOrEq: date }}                            | ${`"${column}" <= '2023-01-31T12:00:00.000Z'`}
  ${{ gt: 23 }}                                      | ${`"${column}" > '23'`}
  ${{ gt: date }}                                    | ${`"${column}" > '2023-01-31T12:00:00.000Z'`}
  ${{ after: 23 }}                                   | ${`"${column}" > '23'`}
  ${{ after: date }}                                 | ${`"${column}" > '2023-01-31T12:00:00.000Z'`}
  ${{ gte: 23 }}                                     | ${`"${column}" >= '23'`}
  ${{ gte: date }}                                   | ${`"${column}" >= '2023-01-31T12:00:00.000Z'`}
  ${{ afterOrEq: 23 }}                               | ${`"${column}" >= '23'`}
  ${{ afterOrEq: date }}                             | ${`"${column}" >= '2023-01-31T12:00:00.000Z'`}
  ${{ between: { start: 25, end: 33 } }}             | ${`"${column}" BETWEEN '25' AND '33'`}
  ${{ between: { start: dateStart, end: dateEnd } }} | ${`"${column}" BETWEEN '2023-03-31T12:00:00.000Z' AND '2023-08-12T12:00:00.000Z'`}
  ${{ in: [1, 3, 5] }}                               | ${`"${column}" IN ('1','3','5')`}
  ${{ in: ['a', 'b', 'c'] }}                         | ${`"${column}" IN ('a','b','c')`}
  ${{ in: [] }}                                      | ${`1!=1`}
  ${{ in: [1, 3, null] }}                            | ${`"${column}" IN ('1','3') OR "${column}" IS NULL`}
  ${{ in: [null] }}                                  | ${`"${column}" IS NULL`}
  ${{ notIn: [1, 3, 5] }}                            | ${`"${column}" NOT IN ('1','3','5')`}
  ${{ notIn: ['a', 'b', 'c'] }}                      | ${`"${column}" NOT IN ('a','b','c')`}
  ${{ contains: 23 }}                                | ${`"${column}" ILIKE '%23%'`}
  ${{ contains: 'test' }}                            | ${`"${column}" ILIKE '%test%'`}
  ${{ notContains: 23 }}                             | ${`"${column}" NOT ILIKE '%23%'`}
  ${{ notContains: 'test' }}                         | ${`"${column}" NOT ILIKE '%test%'`}
  ${{ startsWith: 23 }}                              | ${`"${column}" ILIKE '23%'`}
  ${{ startsWith: 'test' }}                          | ${`"${column}" ILIKE 'test%'`}
  ${{ notStartsWith: 23 }}                           | ${`"${column}" NOT ILIKE '23%'`}
  ${{ notStartsWith: 'test' }}                       | ${`"${column}" NOT ILIKE 'test%'`}
  ${{ endsWith: 23 }}                                | ${`"${column}" ILIKE '%23'`}
  ${{ endsWith: 'test' }}                            | ${`"${column}" ILIKE '%test'`}
  ${{ notEndsWith: 23 }}                             | ${`"${column}" NOT ILIKE '%23'`}
  ${{ notEndsWith: 'test' }}                         | ${`"${column}" NOT ILIKE '%test'`}
  ${{ null: true }}                                  | ${`"${column}" IS NULL`}
  ${{ null: '1' }}                                   | ${`"${column}" IS NULL`}
  ${{ null: 1 }}                                     | ${`"${column}" IS NULL`}
  ${{ isNull: true }}                                | ${`"${column}" IS NULL`}
  ${{ isNull: '1' }}                                 | ${`"${column}" IS NULL`}
  ${{ isNull: 1 }}                                   | ${`"${column}" IS NULL`}
  ${{ notNull: true }}                               | ${`"${column}" IS NOT NULL`}
  ${{ notNull: '1' }}                                | ${`"${column}" IS NOT NULL`}
  ${{ notNull: 1 }}                                  | ${`"${column}" IS NOT NULL`}
  ${{ isNotNull: true }}                             | ${`"${column}" IS NOT NULL`}
  ${{ isNotNull: '1' }}                              | ${`"${column}" IS NOT NULL`}
  ${{ isNotNull: 1 }}                                | ${`"${column}" IS NOT NULL`}
  ${{ [nestedColumn]: { eq: 'test' } }}              | ${`"${column}"."${nestedColumn}" = 'test'`}
`('when operator: $operator', ({ operator, expected }) => {
  it(`should return ${expected}`, async () => {
    const result = operatorToWhereString(column, operator);

    expect(result).toEqual(expected);
  });
});

describe('when provided unknown operator', () => {
  it('should thorw Error', () => {
    const operator = { unexistOperator: 'test' } as IOperator;

    const test = () => operatorToWhereString(column, operator);

    expect(test).toThrow(
      `Unknown operator 'unexistOperator' for column '"${column}"'`,
    );
  });
});
