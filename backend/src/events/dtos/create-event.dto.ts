import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator'
import { EventType } from '../../types/shared.types'

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsEnum(EventType)
  type: EventType

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(10)
  priority: number

  @IsNotEmpty()
  @IsBoolean()
  approved: boolean
}
