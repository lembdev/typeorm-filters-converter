import type { IFilter } from './filters.types';
import type { MockedShallow } from 'jest-mock';
import type { ObjectLiteral, Repository } from 'typeorm';
import { Brackets, Equal } from 'typeorm';
import { FiltersConverter } from './filters.converter';

interface ITestEntity {
  id: number;
  name: string;
  priority: number;
  enabled: boolean;
  employee: {
    firstName: string;
  };
}

const repository = {
  metadata: {
    relations: [{ propertyName: 'name' }, { propertyName: 'employee' }],
  },
} as unknown as MockedShallow<Repository<ITestEntity>>;

it('should be defined', () => {
  expect(FiltersConverter).toBeDefined();
});

describe('addFilters()', () => {
  it('should add a single filter to the internal set', () => {
    const converter = new FiltersConverter();
    const filter = { name: { eq: 'test' } };

    converter.addFilters(filter);

    expect(converter['_filters'].size).toBe(1);
    expect(converter['_filters'].has(filter)).toBe(true);
  });

  it('should add multiple filters to the internal set', () => {
    const converter = new FiltersConverter();
    const filters = [
      { name: { eq: 'test' } },
      { priority: { gt: 5 } },
      { enabled: { eq: true } },
    ];

    converter.addFilters(filters);

    expect(converter['_filters'].size).toBe(3);
    filters.forEach((filter) => {
      expect(converter['_filters'].has(filter)).toBe(true);
    });
  });

  it('should not add anything if no filters are provided', () => {
    const converter = new FiltersConverter();

    converter.addFilters();

    expect(converter['_filters'].size).toBe(0);
  });
});

describe('setGlobalFilter()', () => {
  it('should return instance if `FiltersConverter`', async () => {
    const result = new FiltersConverter().setGlobalFilter({});

    expect(result).toBeInstanceOf(FiltersConverter);
  });

  it('should be able to call multiple times', async () => {
    expect(() => {
      new FiltersConverter()
        .setGlobalFilter({})
        .setGlobalFilter({})
        .setGlobalFilter({})
        .setGlobalFilter({});
    }).not.toThrow();
  });
});

describe('toRepositoryConditions()', () => {
  it('should return empty array if NO filter provided', async () => {
    const result = new FiltersConverter().toRepositoryConditions();

    expect(result).toEqual([]);
  });

  it('should return `FindConditions` list if filters are provided', async () => {
    const filters: IFilter<ITestEntity> = { name: { eq: 'test' } };

    const result = new FiltersConverter(filters).toRepositoryConditions();

    expect(result).toEqual([{ name: Equal('test') }]);
  });

  it('should return `FindConditions` list if NO filters are provided but provided filters by `setGlobalFilter()`', async () => {
    const extraFilters: IFilter<ITestEntity> = { name: { eq: 'test' } };

    const result = new FiltersConverter()
      .setGlobalFilter(extraFilters)
      .toRepositoryConditions();

    expect(result).toEqual([{ name: Equal('test') }]);
  });

  it('should return combined `FindConditions` list if filters and additional filters are provided', async () => {
    const filters: IFilter<ITestEntity> = { name: { eq: 'test' } };
    const extraFilters: IFilter<ITestEntity> = { priority: { eq: 12 } };

    const result = new FiltersConverter(filters)
      .setGlobalFilter(extraFilters)
      .toRepositoryConditions();

    expect(result).toEqual([{ name: Equal('test'), priority: Equal(12) }]);
  });

  it('should return combined `FindConditions` list if federated filters and additional filters are provided', async () => {
    const filters: IFilter<ITestEntity>[] = [
      { name: { eq: 'test' } },
      { name: { eq: 'alternate' } },
    ];
    const extraFilters: IFilter<ITestEntity> = { priority: { eq: 12 } };

    const result = new FiltersConverter(filters)
      .setGlobalFilter(extraFilters)
      .toRepositoryConditions();

    expect(result).toEqual([
      { name: Equal('test'), priority: Equal(12) },
      { name: Equal('alternate'), priority: Equal(12) },
    ]);
  });
});

describe('getAffectedRepositoryRelations()', () => {
  describe('when NO filters provided', () => {
    it('should return empty array', async () => {
      const converter = new FiltersConverter();
      const result = converter.getAffectedRepositoryRelations(
        repository as Repository<ObjectLiteral>,
      );

      expect(Array.isArray(result)).toBeTruthy();
      expect(result.length).toBe(0);
    });
  });

  describe('when filters provided', () => {
    it('should return array of affected relations', async () => {
      const filters: IFilter<ITestEntity> = { name: { eq: 'test' } };
      const converter = new FiltersConverter(filters);

      const result = converter.getAffectedRepositoryRelations(repository);

      expect(result).toEqual(['name']);
    });
  });

  describe('when nested filters provided', () => {
    const filters: IFilter<ITestEntity> = {
      name: { contains: 'dev' },
      employee: {
        firstName: { contains: 'John' },
      },
    };
    const extraFilters: IFilter<ITestEntity> = { priority: { eq: 12 } };
    const converter = new FiltersConverter(filters);

    const result = converter
      .setGlobalFilter(extraFilters)
      .getAffectedRepositoryRelations(repository);

    expect(result).toEqual(['name', 'employee']);
  });

  describe('when additional filters provided', () => {});
});

describe('toQueryBuilderConditions()', () => {
  it('should return a Brackets object with the correct conditions', () => {
    const filters = {
      name: { eq: 'John' },
      age: { gt: 30 },
    };
    const converter = new FiltersConverter(filters);

    const result = converter.toQueryBuilderConditions();

    expect(result).toBeInstanceOf(Brackets);
  });
});
