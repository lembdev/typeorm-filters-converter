import { toColumnName } from './to-column-name.helper';

describe('When passed column w/o quotas', () => {
  it('should return column with quotas', () => {
    expect(toColumnName('column')).toBe('"column"');
  });
});

describe('When passed column w/ quotas', () => {
  it('should return column with quotas', () => {
    expect(toColumnName('"column"')).toBe('"column"');
  });
});

describe('When passed calculated column', () => {
  it('should return column with quotas', () => {
    expect(toColumnName("(first_name || ' ' || last_name)")).toBe(
      "(first_name || ' ' || last_name)",
    );
  });
});
