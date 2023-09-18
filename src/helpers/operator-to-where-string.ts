import type { IOperator } from '../filters.types';
import { toColumnName } from './to-column-name.helper';

const arrayToWhereString = (
  column: string,
  value: unknown[],
  operator: 'IN' | 'NOT IN',
): string => {
  const withoutNull = value.filter((v) => v !== null);
  const nullCondition = value.includes(null) ? `${column} IS NULL` : '';

  if (withoutNull.length > 0)
    return `${column} ${operator} ('${withoutNull.join(`','`)}') ${
      nullCondition ? `OR ${nullCondition}` : ''
    }`.trim();

  if (nullCondition) {
    return nullCondition;
  }

  return '1!=1';
};

const valueToParameter = (value: unknown): unknown =>
  value instanceof Date ? value.toISOString() : value;

export const operatorToWhereString = (
  column: string,
  operator: IOperator,
  fieldMapping?: Map<string, string>,
): string => {
  const columnName = toColumnName(column, fieldMapping);
  const conditionOperator = Object.keys(operator)[0];
  const value = Object.values(operator)[0];

  switch (conditionOperator) {
    case 'eq':
      return `${columnName} = '${valueToParameter(value)}'`;
    case 'notEq':
      return `${columnName} != '${valueToParameter(value)}'`;
    case 'lt':
    case 'before':
      return `${columnName} < '${valueToParameter(value)}'`;
    case 'lte':
    case 'beforeOrEq':
      return `${columnName} <= '${valueToParameter(value)}'`;
    case 'gt':
    case 'after':
      return `${columnName} > '${valueToParameter(value)}'`;
    case 'gte':
    case 'afterOrEq':
      return `${columnName} >= '${valueToParameter(value)}'`;
    case 'between':
      const isDateValue = value.start instanceof Date;
      const start = isDateValue ? value.start.toISOString() : value.start;
      const end = isDateValue ? value.end.toISOString() : value.end;
      return `${columnName} BETWEEN '${start}' AND '${end}'`;
    case 'in':
      return arrayToWhereString(columnName, value, 'IN');
    case 'notIn':
      return arrayToWhereString(columnName, value, 'NOT IN');
    case 'contains':
      return `${columnName} ILIKE '%${value}%'`;
    case 'notContains':
      return `${columnName} NOT ILIKE '%${value}%'`;
    case 'startsWith':
      return `${columnName} ILIKE '${value}%'`;
    case 'notStartsWith':
      return `${columnName} NOT ILIKE '${value}%'`;
    case 'endsWith':
      return `${columnName} ILIKE '%${value}'`;
    case 'notEndsWith':
      return `${columnName} NOT ILIKE '%${value}'`;
    case 'null':
    case 'isNull':
      return `${columnName} IS NULL`;
    case 'notNull':
    case 'isNotNull':
      return `${columnName} IS NOT NULL`;
    default:
      if (typeof value === 'object') {
        return Object.entries(operator)
          .map(([key, value]) =>
            operatorToWhereString(`${column}.${key}`, value),
          )
          .join(' AND ');
      }

      throw new Error(
        `Unknown operator '${conditionOperator}' for column '${columnName}'`,
      );
  }
};
