import { Expose, Transform } from 'class-transformer'
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

export class EventDto {
  @Expose()
  id: number

  @IsBoolean()
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string

  @IsNotEmpty()
  @IsString()
  @Expose()
  description: string

  @IsNotEmpty()
  @IsEnum(EventType)
  @Expose()
  type: EventType

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(10)
  @Expose()
  priority: number

  @IsNotEmpty()
  @IsBoolean()
  @Expose()
  approved: boolean

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number
}
