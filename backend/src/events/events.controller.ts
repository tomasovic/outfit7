import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { CreateEventDto } from './dtos/create-event.dto'
import { EventsService } from './events.service'
import { AuthGuard } from '../guards/auth.guard'
import { CurrentUser } from '../users/decorators/current-user.decorator'
import { User } from '../users/user.entity'
import { ApproveEventDto } from './dtos/approve-event.dto'
import { AdminGuard } from '../guards/admin.guard'
import { Serialize } from '../interceptors/serialize.interceptor'
import { EventDto } from './dtos/event.dto'
import { UpdateEventDto } from './dtos/update-event.dto'
import { EventType, IQuery } from '../types/shared.types'
import { Like } from 'typeorm'

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get('/count')
  @UseGuards(AuthGuard)
  countEvents() {
    return this.eventsService.count()
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAllEvents(@Query() query: IQuery) {
    const {
      page = 1,
      sort = 'id',
      order = 'desc',
      approved,
      name,
      type,
      priority,
      desc,
    } = query

    let { limit = 10 } = query

    limit = limit > 100 ? 100 : limit
    const where = { approved, name, type: type as EventType, priority }

    if (desc) {
      where['description'] = Like(`%${desc}%`)
    }

    Object.keys(where).forEach(
      (key) => where[key] === undefined && delete where[key],
    )

    const [events, total] = await this.eventsService.findAll({
      take: limit,
      skip: (page - 1) * limit,
      order: { [sort]: order.toUpperCase() },
      where,
    })

    return { total, events }
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(EventDto)
  createEvent(@Body() body: CreateEventDto, @CurrentUser() user: User) {
    return this.eventsService.create(body, user)
  }

  @Get('/:id')
  async findEvent(@Param('id') id: string) {
    const event = await this.eventsService.findOne(parseInt(id))
    if (!event) {
      throw new NotFoundException('Event was not found.')
    }
    return event
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveEvent(@Param('id') id: number, @Body() body: ApproveEventDto) {
    return this.eventsService.changeApproval(id, body.approved)
  }

  @Patch('/event/:id')
  @UseGuards(AdminGuard)
  updateEvent(@Param('id') id: string, @Body() body: UpdateEventDto) {
    return this.eventsService.update(parseInt(id), body)
  }

  @Delete('/:id')
  @UseGuards(AdminGuard)
  removeEvent(@Param('id') id: string) {
    return this.eventsService.remove(parseInt(id))
  }
}
