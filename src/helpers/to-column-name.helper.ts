export const toColumnName = (
  columnName: string,
  fieldMapping?: Map<string, string>,
): string => {
  // This allow to bypass the dynamical column name. Like: `(first_name || ' ' || last_name)`
  if (columnName.startsWith('(') && columnName.endsWith(')')) {
    return columnName;
  }

  const column = fieldMapping?.get(columnName) || columnName;

  return column
    .split('.')
    .map((name) => `"${name}"`.replaceAll('""', '"'))
    .join(`.`);
};
