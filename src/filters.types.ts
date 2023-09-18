export interface IBooleanOperator {
  readonly eq: boolean;
}

export interface IDateOperator {
  readonly eq?: Date | null;
  readonly notEq?: Date | null;
  readonly before?: Date;
  readonly beforeOrEq?: Date;
  readonly after?: Date;
  readonly afterOrEq?: Date;
  readonly between?: IDateRange;
  readonly isNull?: boolean;
  readonly isNotNull?: boolean;
}

export interface ITimeOperator {
  readonly eq?: string | null;
  readonly notEq?: string | null;
  readonly before?: string;
  readonly beforeOrEq?: string;
  readonly after?: string;
  readonly afterOrEq?: string;
  readonly between?: ITimeRange;
  readonly isNull?: boolean;
  readonly isNotNull?: boolean;
}

export interface INumberOperator {
  readonly eq?: number | null;
  readonly notEq?: number | null;
  readonly lt?: number;
  readonly lte?: number;
  readonly gt?: number;
  readonly gte?: number;
  readonly in?: number[];
  readonly notIn?: number[];
  readonly between?: INumberRange;
  readonly isNull?: boolean;
  readonly isNotNull?: boolean;
}

export interface IStringOperator {
  readonly eq?: string | null;
  readonly notEq?: string | null;
  readonly contains?: string;
  readonly notContains?: string;
  readonly startsWith?: string;
  readonly notStartsWith?: string;
  readonly endsWith?: string;
  readonly notEndsWith?: string;
  readonly in?: string[];
  readonly notIn?: string[];
  readonly isNull?: boolean;
  readonly isNotNull?: boolean;
}

export interface IDateRange {
  readonly start: Date;
  readonly end: Date;
}

export interface ITimeRange {
  readonly start: string;
  readonly end: string;
}

export interface INumberRange {
  readonly start: number;
  readonly end: number;
}

export type IOperator =
  | IBooleanOperator
  | IDateOperator
  | INumberOperator
  | IStringOperator;

export type IFilter<T> = {
  readonly [P in keyof T]?: IOperator | IFilter<T[P]>;
};
