# `@lembdev/typeorm-filters-converter`

[![Release](https://github.com/lembdev/typeorm-filters-converter/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/lembdev/typeorm-filters-converter/actions/workflows/release.yml)

This lib is intended to be used for converting filters in the context of SQL-based debate repositories (e.g. TypeORM ones). Particularly, it helps in the creation of filter conditions for using with repository queries and query builders in TypeORM. It also provides ways to handle global filters which are applied to all other filters.

## Table of Contents

1. [Constructor](#constructor)
2. [setFilters](#setFilters)
3. [getFilters](#getFilters)
4. [addFilters](#addFilters)
5. [setGlobalFilter](#setGlobalFilter)
6. [toRepositoryConditions](#toRepositoryConditions)
7. [toQueryBuilderConditions](#toQueryBuilderConditions)
8. [getAffectedColumns](#getAffectedColumns)
9. [getAffectedRepositoryRelations](#getAffectedRepositoryRelations)

## Constructor

```typescript
constructor(
  filters?: IFilter<T> | IFilter<T>[],
  fieldMapping?: Map<string, string>
)
```

Creates an instance of filters converter. Takes filters and field mapping as inputs. Filters could either be a single filter or an array of them.

## setFilters

```typescript
setFilters(filters: IFilter<T> | IFilter<T>[]): void
```

Resets the existing filters and sets the new filters. The new filters can be either a single filter or an array of filters.
getFilters

**Examples:**

```typescript
const converter = new FiltersConverter();
converter.setFilters({ id: { eq: 1 } });
```

```typescript
const converter = new FiltersConverter();
converter.setFilters([{ id: { eq: 1 } }, { id: { eq: 2 } }]);
```

## getFilters

```typescript
getFilters(): IFilter<T>[]
```

Returns the filters that are currently being applied, as an array of individual filters.

**Examples:**

```typescript
const converter = new FiltersConverter();
converter.setFilters({ id: { eq: 1 } });
converter.setGlobalFilter({ age: { gte: 19 } });
converter.getFilters(); // [{ id: { eq: 1 }, age: { gte: 19 } }]
```

## addFilters

```typescript
addFilters(filters?: IFilter<T> | IFilter<T>[]): this
```

Adds more filters without resetting the previously set filters. These new filters can be either a single filter or an array of filters.

**Examples:**

```typescript
const converter = new FiltersConverter();
converter.setFilters({ name: { eq: 'Sam' } });
converter.addFilters({ age: { gte: 19 } });
converter.getFilters(); // [{ name: { eq: 'Sam' } }, { age: { gte: 19 } }]
```

## setGlobalFilter

```typescript
setGlobalFilter(filters?: IFilter<T>): this
```

Sets a global filter that gets applied to every filter in the filter set.

**Examples:**

```typescript
const converter = new FiltersConverter();
converter.setFilters([{ name: { eq: 'Sam' } }, { name: { eq: 'Alex' } }]);
converter.setGlobalFilter({ age: { gte: 19 } });
// same as
converter.setFilters([
  { name: { eq: 'Sam' }, age: { gte: 19 } },
  { name: { eq: 'Alex' }, age: { gte: 19 } },
]);
```

```typescript
const converter = new FiltersConverter();
converter.setFilters([{ name: { eq: 'Sam' } }, { name: { eq: 'Alex' } }]);
converter.setGlobalFilter({ age: { gte: 19 } });
converter.setGlobalFilter({ sex: { eq: 'male' } });
// same as
converter.setFilters([
  { name: { eq: 'Sam' }, age: { gte: 19 }, sex: { eq: 'male' } },
  { name: { eq: 'Alex' }, age: { gte: 19 }, sex: { eq: 'male' } },
]);
```

## toRepositoryConditions

```typescript
toRepositoryConditions(): FindConditions<T>[]
```

Transforms the filters to a format that can be handled by TypeORM repositories for filtering purposes.

**Examples:**

```typescript
const converter = new FiltersConverter();
converter.setFilters({ name: { eq: 'Sam' } });

const users = await this.userRepository.find({
  where: converter.toRepositoryConditions(),
});
```

## toQueryBuilderConditions

```typescript
toQueryBuilderConditions(): Brackets
```

Transforms the filters into a format that can be handled by TypeORM's QueryBuilder.

**Examples:**

```typescript
const converter = new FiltersConverter();
converter.setFilters({ name: { eq: 'Sam' } });

const users = await this.dataSource
  .createQueryBuilder()
  .select()
  .from('users', 'user')
  .where(converter.toQueryBuilderConditions())
  .getRawMany();
```

## getAffectedColumns

```typescript
getAffectedColumns(): string[]
```

Returns an array containing the names of the columns that have been affected by the filter conditions.

## getAffectedRepositoryRelations

```typescript
getAffectedRepositoryRelations(repository: Repository<T>): string[]
```

Returns an array containing the names of the relations that have been affected by the filter conditions, based on the given repository.
