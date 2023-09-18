import type { IFilter } from './filters.types';
import type { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import { Brackets } from 'typeorm';
import { toFindConditions } from './helpers/to-find-conditions';
import { operatorToWhereString } from './helpers/operator-to-where-string';

export class FiltersConverter<T extends ObjectLiteral> {
  private _fieldMapping: Map<string, string>;
  private _filters = new Set<IFilter<T>>();
  private _globalFilters?: IFilter<T>;

  constructor(filters?: IFilter<T>[], fieldMapping?: Map<string, string>);
  constructor(filters?: IFilter<T>, fieldMapping?: Map<string, string>);
  constructor(
    filters?: IFilter<T> | IFilter<T>[],
    fieldMapping: Map<string, string> = new Map(),
  ) {
    this.setFilters(filters);
    this._fieldMapping = fieldMapping || new Map();
  }

  /**
   * Set filters to toRepositoryConditions.
   * It rewrite existing filters.
   *
   * @example
   * const converter = new FiltersConverter()
   * converter.setFilters({ id: { eq: 1 } })
   *
   * @example
   * const converter = new FiltersConverter()
   * converter.setFilters([{ id: { eq: 1 } }, { id: { eq: 2 } }])
   */
  setFilters(filters?: IFilter<T> | IFilter<T>[]): this {
    this._filters.clear();

    if (!filters) {
      return this;
    }

    const filtersCollection = Array.isArray(filters) ? filters : [filters];

    filtersCollection.forEach((filter) => {
      this._filters.add(filter);
    });

    return this;
  }

  /**
   * Retrieves the filters that are currently applied to the converter.
   *
   * @example
   * const converter = new FiltersConverter()
   * converter.setFilters({ id: { eq: 1 } })
   * converter.setGlobalFilter({ age: { gte: 19 } })
   * converter.getFilters() // [{ id: { eq: 1 }, age: { gte: 19 } }]
   */
  getFilters(): IFilter<T>[] {
    if (this._globalFilters) {
      if (this._filters.size) {
        return Array.from(this._filters, (filter) => ({
          ...filter,
          ...this._globalFilters,
        }));
      } else {
        return [this._globalFilters];
      }
    }

    return [...this._filters];
  }

  /**
   * Set filters to toRepositoryConditions.
   * It NOT rewrite existing filters, just append new ones.
   *
   * @example
   * const converter = new FiltersConverter()
   * converter.setFilters({ name: { eq: 'Sam' } })
   * converter.addFilters({ age: { gte: 19 } })
   * // same as
   * converter.setFilters([{ name: { eq: 'Sam' } }, { age: { gte: 19 } }])
   */
  addFilters(filters?: IFilter<T> | IFilter<T>[]): this {
    if (!filters) {
      return this;
    }

    const filtersCollection = Array.isArray(filters) ? filters : [filters];

    filtersCollection.forEach((filter) => {
      this._filters.add(filter);
    });

    return this;
  }

  /**
   * Add a filter condition to each filter.
   * It could be called multiple times if needed (conditions will be stacked).
   *
   * @example
   * const converter = new FiltersConverter()
   * converter.setFilters([
   *   { name: { eq: 'Sam' } },
   *   { name: { eq: 'Alex' } }
   * ])
   * converter.setGlobalFilter({ age: { gte: 19 } })
   * // same as
   * converter.setFilters([
   *   { name: { eq: 'Sam' }, age: { gte: 19 } },
   *   { name: { eq: 'Alex' }, age: { gte: 19 } }
   * ])
   *
   * @example when called multiple times
   * const converter = new FiltersConverter()
   * converter.setFilters([
   *   { name: { eq: 'Sam' } },
   *   { name: { eq: 'Alex' } }
   * ])
   * converter.setGlobalFilter({ age: { gte: 19 } })
   * converter.setGlobalFilter({ sex: { eq: 'male' } })
   * // same as
   * converter.setFilters([
   *   { name: { eq: 'Sam' }, age: { gte: 19 }, sex: { eq: 'male' } },
   *   { name: { eq: 'Alex' }, age: { gte: 19 }, sex: { eq: 'male' } }
   * ])
   */
  setGlobalFilter(filters?: IFilter<T>): this {
    if (filters) {
      this._globalFilters = { ...this._globalFilters, ...filters };
    }

    return this;
  }

  /**
   * Get where conditions used in TypeORM repository.
   *
   * @example
   * const converter = new FiltersConverter()
   * converter.setFilters({ name: { eq: 'Sam' } })
   *
   * const users = await this.userRepository.find({
   *   where: converter.toRepositoryConditions(),
   * });
   */
  toRepositoryConditions(): FindOptionsWhere<T>[] {
    return this.getFilters().map((filter) => toFindConditions(filter));
  }

  /**
   * Get where conditions used in TypeORM query builder.
   *
   * @example
   * const converter = new FiltersConverter()
   * converter.setFilters({ name: { eq: 'Sam' } })
   *
   * const users = await this.dataSource
   *   .createQueryBuilder()
   *   .select()
   *   .from('users', 'user')
   *   .where(converter.toQueryBuilderConditions())
   *   .getRawMany();
   */
  toQueryBuilderConditions(): Brackets {
    const filters = this.getFilters();

    return new Brackets((queryBuilder) => {
      filters.forEach((filter) => {
        const brackets = new Brackets((nestedQueryBuilder) => {
          Object.entries(filter).forEach(([key, value]) => {
            const conditions = operatorToWhereString(
              key,
              value as IFilter<T>,
              this._fieldMapping,
            );
            nestedQueryBuilder.andWhere(conditions);
          });
        });

        queryBuilder.orWhere(brackets);
      });
    });
  }

  /**
   * Retrieves an array of affected columns based on the applied filters.
   */
  getAffectedColumns(): string[] {
    const afffectedColumns = new Set<string>();

    this.getFilters().forEach((filter) => {
      Object.keys(filter).forEach((key) => {
        afffectedColumns.add(key);
      });
    });

    return [...afffectedColumns];
  }

  /**
   * Finds the affected relations in the given repository based on the applied filters.
   */
  getAffectedRepositoryRelations(repository: Repository<T>): string[] {
    const afffectedColumns = this.getAffectedColumns();
    const availableRelations = repository.metadata.relations.map(
      (relation) => relation.propertyName,
    );

    return [...afffectedColumns].filter((column) =>
      availableRelations.includes(column),
    );
  }
}
