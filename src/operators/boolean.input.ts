import type { IBooleanOperator } from '../filters.types';
import { IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BooleanInput implements IBooleanOperator {
  @Type(() => Boolean)
  @IsBoolean()
  @ApiProperty({ type: Boolean })
  readonly eq!: boolean;
}
