import type { IDateOperator } from '../filters.types';
import { IsBoolean, IsDate, ValidateIf, ValidateNested } from 'class-validator';
import { hasOtherValues } from '../helpers/has-other-values';
import { DateRangeInput } from './date-range.input';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DateInput implements IDateOperator {
  @Type(() => Date)
  @IsDate()
  @ValidateIf((obj) => !hasOtherValues(obj, 'eq'))
  @ApiProperty({ type: Date, nullable: true })
  readonly eq?: Date | null;

  @Type(() => Date)
  @IsDate()
  @ValidateIf((obj) => !hasOtherValues(obj, 'notEq'))
  @ApiProperty({ type: Date, nullable: true })
  readonly notEq?: Date | null;

  @Type(() => Date)
  @IsDate()
  @ValidateIf((obj) => !hasOtherValues(obj, 'before'))
  @ApiProperty({ type: Date, nullable: true })
  readonly before?: Date;

  @Type(() => Date)
  @IsDate()
  @ValidateIf((obj) => !hasOtherValues(obj, 'beforeOrEq'))
  @ApiProperty({ type: Date, nullable: true })
  readonly beforeOrEq?: Date;

  @Type(() => Date)
  @IsDate()
  @ValidateIf((obj) => !hasOtherValues(obj, 'after'))
  @ApiProperty({ type: Date, nullable: true })
  readonly after?: Date;

  @Type(() => Date)
  @IsDate()
  @ValidateIf((obj) => !hasOtherValues(obj, 'afterOrEq'))
  @ApiProperty({ type: Date, nullable: true })
  readonly afterOrEq?: Date;

  @Type(() => DateRangeInput)
  @ValidateIf((obj) => !hasOtherValues(obj, 'between'))
  @ApiProperty({ type: Date, nullable: true })
  @ValidateNested()
  readonly between?: DateRangeInput;

  @Type(() => Boolean)
  @IsBoolean()
  @ValidateIf((obj) => !hasOtherValues(obj, 'isNull'))
  @ApiProperty({ type: Boolean, nullable: true })
  readonly isNull?: boolean;

  @Type(() => Boolean)
  @IsBoolean()
  @ValidateIf((obj) => !hasOtherValues(obj, 'isNotNull'))
  @ApiProperty({ type: Boolean, nullable: true })
  readonly isNotNull?: boolean;
}
