import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator'
import { EventType } from '../../types/shared.types'

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  description: string

  @IsEnum(EventType)
  @IsOptional()
  type: EventType

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  priority: number

  @IsBoolean()
  @IsOptional()
  approved: boolean
}
