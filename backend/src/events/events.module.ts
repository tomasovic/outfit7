import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventsService } from './events.service'
import { Event } from './event.entity'
import { EventsController } from './events.controller'
import { ExternalApiService } from '../external/external-api.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [TypeOrmModule.forFeature([Event]), HttpModule],
  controllers: [EventsController],
  providers: [EventsService, ExternalApiService],
})
export class EventsModule {}
