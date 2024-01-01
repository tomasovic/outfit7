import { EventsController } from '../events.controller'
import { EventsService } from '../events.service'
import { ExternalApiService } from '../../external/external-api.service'
import { User } from '../../users/user.entity'
import { Test } from '@nestjs/testing'
import { Like } from 'typeorm'
import { CreateEventDto } from '../dtos/create-event.dto'
import { NotFoundException } from '@nestjs/common'
import { Event } from '../event.entity'
import { ApproveEventDto } from '../dtos/approve-event.dto'
import { UpdateEventDto } from '../dtos/update-event.dto'

describe('EventsController', () => {
  let controller: EventsController
  let eventsService: Partial<EventsService>
  let externalApiService: Partial<ExternalApiService>
  let user: User

  beforeEach(async () => {
    eventsService = {
      create: jest.fn().mockResolvedValue({}),
      findAll: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      changeApproval: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      remove: jest.fn().mockResolvedValue(null),
    }

    externalApiService = {}

    user = new User()

    const module = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        { provide: EventsService, useValue: eventsService },
        { provide: ExternalApiService, useValue: externalApiService },
      ],
    }).compile()

    controller = module.get<EventsController>(EventsController)
  })

  it('returns all events with default query parameters', async () => {
    await controller.findAllEvents({
      page: 1,
      limit: 10,
      sort: 'asc',
      order: 'id',
      approved: true,
      name: '',
      type: '',
      priority: 0,
      desc: '',
      skip: (1 - 1) * 10,
    })

    expect(eventsService.findAll).toHaveBeenCalledWith({
      take: 10,
      skip: 0,
      order: { asc: 'ID' },
      where: {
        approved: true,
        name: '',
        priority: 0,
        type: '',
      },
    })
  })

  it('returns all events with custom query parameters', async () => {
    await controller.findAllEvents({
      page: 2,
      limit: 10,
      sort: 'desc',
      order: 'id',
      approved: false,
      name: 'test',
      type: 'EventType',
      priority: 1,
      desc: 'description',
      skip: (2 - 1) * 10,
    })

    expect(eventsService.findAll).toHaveBeenCalledWith({
      take: 10,
      skip: 10,
      order: { desc: 'ID' },
      where: {
        approved: false,
        name: 'test',
        type: 'EventType',
        priority: 1,
        description: Like('%description%'),
      },
    })
  })

  it('limits the maximum number of events returned', async () => {
    await controller.findAllEvents({
      page: 1,
      limit: 10,
      sort: 'asc',
      order: 'id',
      approved: true,
      name: '',
      type: '',
      priority: 0,
      desc: '',
      skip: (1 - 1) * 10,
    })

    expect(eventsService.findAll).toHaveBeenCalledWith({
      take: 10,
      skip: 0,
      order: { asc: 'ID' },
      where: {
        approved: true,
        name: '',
        priority: 0,
        type: '',
      },
    })
  })

  it('creates an event successfully', async () => {
    const createEventDto = new CreateEventDto()

    await controller.createEvent(createEventDto, user)

    expect(eventsService.create).toHaveBeenCalledWith(createEventDto, user)
  })

  it('finds an event successfully', async () => {
    const id = '1'
    const event = new Event()

    jest.spyOn(eventsService, 'findOne').mockResolvedValue(event)

    const result = await controller.findEvent(id)

    expect(result).toEqual(event)
    expect(eventsService.findOne).toHaveBeenCalledWith(parseInt(id))
  })

  it('throws an error when finding an event that does not exist', async () => {
    const id = '1'

    jest.spyOn(eventsService, 'findOne').mockResolvedValue(null)

    await expect(controller.findEvent(id)).rejects.toThrow(NotFoundException)
    expect(eventsService.findOne).toHaveBeenCalledWith(parseInt(id))
  })

  it('approves an event successfully', async () => {
    const id = 1
    const approved = true

    jest.spyOn(eventsService, 'changeApproval').mockResolvedValue({} as Event)

    await controller.approveEvent(id, { approved })

    expect(eventsService.changeApproval).toHaveBeenCalledWith(id, approved)
  })

  it('throws an error when approving an event that does not exist', async () => {
    const id = -1
    const approveEventDto: ApproveEventDto = { approved: true }

    jest
      .spyOn(eventsService, 'changeApproval')
      .mockRejectedValue(new NotFoundException('Event not found'))

    await expect(controller.approveEvent(id, approveEventDto)).rejects.toThrow(
      NotFoundException,
    )

    expect(eventsService.changeApproval).toHaveBeenCalledWith(
      id,
      approveEventDto.approved,
    )
  })

  it('updates an event successfully', async () => {
    const id = '1'
    const updateEventDto = new UpdateEventDto()

    jest.spyOn(eventsService, 'update').mockResolvedValue({} as Event)

    await controller.updateEvent(id, updateEventDto)

    expect(eventsService.update).toHaveBeenCalledWith(
      parseInt(id),
      updateEventDto,
    )
  })

  it('throws an error when updating an event that does not exist', async () => {
    const id = '-1'
    const updateEventDto = new UpdateEventDto()

    jest
      .spyOn(eventsService, 'update')
      .mockRejectedValue(new NotFoundException('Event not found'))

    await expect(controller.updateEvent(id, updateEventDto)).rejects.toThrow(
      NotFoundException,
    )
    expect(eventsService.update).toHaveBeenCalledWith(
      parseInt(id),
      updateEventDto,
    )
  })

  it('removes an event successfully', async () => {
    const id = '1'

    jest.spyOn(eventsService, 'remove').mockResolvedValue({} as Event)

    await controller.removeEvent(id)

    expect(eventsService.remove).toHaveBeenCalledWith(parseInt(id))
  })

  it('throws an error when removing an event that does not exist', async () => {
    const id = '-1'

    jest
      .spyOn(eventsService, 'remove')
      .mockRejectedValue(new NotFoundException('Event not found'))

    await expect(controller.removeEvent(id)).rejects.toThrow(NotFoundException)
    expect(eventsService.remove).toHaveBeenCalledWith(parseInt(id))
  })
})
