import {Injectable, NotFoundException} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {FindManyOptions, Repository} from 'typeorm'
import {CreateEventDto} from './dtos/create-event.dto'
import {User} from '../users/user.entity'
import {Event} from './event.entity'
import {EventType} from '../types/shared.types'

@Injectable()
export class EventsService {
  constructor(@InjectRepository(Event) private repo: Repository<Event>) {
  }

  async count() {
    const rawCounts = await this.repo
      .createQueryBuilder('event')
      .select('event.type', 'type')
      .addSelect('COUNT(event.id)', 'count')
      .where('event.type IN (:...types)', {
        types: [EventType.App, EventType.Ads, EventType.LiveOps, EventType.CrossPromo]
      })
      .groupBy('event.type')
      .getRawMany()

    return rawCounts.reduce((acc, item) => {
      acc[item.type] = item.count
      return acc
    }, {})
  }

  create(eventDto: CreateEventDto, user: User) {
    const event = this.repo.create(eventDto)
    if (user && user.admin === true) {
      event.approved = true
    }

    event.user = user
    return this.repo.save(event)
  }

  findOne(id: number) {
    if (!id) {
      return null
    }
    return this.repo.findOne({where: {id}})
  }

  async update(id: number, attrs: Partial<Event>) {
    const event = await this.findOne(id)
    if (!event) {
      throw new NotFoundException('Event was not found.')
    }
    Object.assign(event, attrs)
    return this.repo.save(event)
  }

  async changeApproval(id: number, approved: boolean) {
    const event = await this.repo.findOne({where: {id}})
    if (!event) {
      throw new NotFoundException('Event was not found.')
    }

    event.approved = approved
    return this.repo.save(event)
  }

  findAll(options?: FindManyOptions<Event>) {
    return this.repo.findAndCount(options)
  }

  async remove(id: number) {
    const event = await this.findOne(id)
    if (!event) {
      throw new NotFoundException('Event was not found.')
    }
    return this.repo.softRemove(event)
  }
}
