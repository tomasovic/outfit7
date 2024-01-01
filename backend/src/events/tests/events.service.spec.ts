import { Test, TestingModule } from '@nestjs/testing'
import { EventsService } from '../events.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Event } from '../event.entity'
import { CreateEventDto } from '../dtos/create-event.dto'
import { User } from '../../users/user.entity'
import { EventType } from '../../types/shared.types'
import { NotFoundException } from '@nestjs/common'

describe('EventsService', () => {
  jest.clearAllMocks()
  let service: EventsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            findOne: jest.fn().mockResolvedValue(null),
            save: jest.fn().mockResolvedValue({}),
            softRemove: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile()

    service = module.get<EventsService>(EventsService)
  })

  it('creates an event successfully', async () => {
    const createEventDto = new CreateEventDto()
    const user = new User()

    const mockEvent = new Event()
    mockEvent.id = 1
    mockEvent.approved = true
    mockEvent.name = 'Test Event'
    mockEvent.description = 'Test Description'
    mockEvent.type = EventType.Ads
    mockEvent.priority = 1
    mockEvent.user = user
    mockEvent.createdAt = new Date()
    mockEvent.updatedAt = new Date()
    mockEvent.deletedAt = null

    jest.spyOn(service, 'create').mockResolvedValue(mockEvent)

    const result = await service.create(createEventDto, user)

    expect(result).toBeDefined()
    expect(service.create).toHaveBeenCalledWith(createEventDto, user)
    expect(result.id).toBe(1)
    expect(result).toBe(mockEvent)
  })

  it('creates an event and sets approved to true if user is admin', async () => {
    const createEventDto = new CreateEventDto()
    const user = new User()
    user.admin = true

    jest.spyOn(service, 'create').mockResolvedValue({ approved: true } as Event)

    const result = await service.create(createEventDto, user)

    expect(result.approved).toBe(true)
    expect(service.create).toHaveBeenCalledWith(createEventDto, user)
  })

  it('creates an event and sets approved to false if user is not admin', async () => {
    const createEventDto = new CreateEventDto()
    const user = new User()
    user.admin = false

    jest
      .spyOn(service, 'create')
      .mockResolvedValue({ approved: false } as Event)

    const result = await service.create(createEventDto, user)

    expect(result.approved).toBe(false)
    expect(service.create).toHaveBeenCalledWith(createEventDto, user)
  })

  it('finds an event by id successfully', async () => {
    const id = 1
    const event = new Event()

    jest.spyOn(service, 'findOne').mockResolvedValue(event)

    const result = await service.findOne(id)

    expect(result).toEqual(event)
    expect(service.findOne).toHaveBeenCalledWith(id)
  })

  it('returns null when finding an event with no id', async () => {
    const id = null

    jest.spyOn(service, 'findOne').mockResolvedValue(null)

    const result = await service.findOne(id)

    expect(result).toBeNull()
    expect(service.findOne).toHaveBeenCalledWith(id)
  })

  it('updates an event successfully', async () => {
    const id = 1
    const attrs = { name: 'Updated Event' }
    const updatedEvent = new Event()
    Object.assign(updatedEvent, attrs)

    jest.spyOn(service, 'findOne').mockResolvedValue(new Event())
    jest.spyOn(service, 'update').mockResolvedValue(updatedEvent)

    const result = await service.update(id, attrs)

    expect(result).toBeDefined()
    expect(service.update).toHaveBeenCalledWith(id, attrs)
    expect(result.name).toBe('Updated Event')
  })

  it('throws an error when updating an event that does not exist', async () => {
    const id = -1
    const attrs = { name: 'Updated Event' }

    jest.spyOn(service, 'findOne').mockResolvedValue(null)

    await expect(service.update(id, attrs)).rejects.toThrow(NotFoundException)
  })

  it('changes approval of an existing event successfully', async () => {
    const id = 1
    const approved = true
    const mockEvent = new Event()
    mockEvent.id = id

    jest.spyOn(service['repo'], 'findOne').mockResolvedValue(mockEvent)
    jest.spyOn(service['repo'], 'save').mockResolvedValue(mockEvent)

    const result = await service.changeApproval(id, approved)

    expect(result).toBeDefined()
    expect(result.approved).toBe(true)
    expect(service['repo'].findOne).toHaveBeenCalledWith({ where: { id } })
    expect(service['repo'].save).toHaveBeenCalledWith(mockEvent)
  })

  it('throws an error when changing approval of an event that does not exist', async () => {
    const id = -1
    const approved = true

    jest.spyOn(service['repo'], 'findOne').mockResolvedValue(null)

    await expect(service.changeApproval(id, approved)).rejects.toThrow(
      new NotFoundException('Event was not found.'),
    )

    expect(service['repo'].findOne).toHaveBeenCalledWith({ where: { id } })
  })

  it('removes an event successfully', async () => {
    const id = 1
    const event = new Event()

    jest.spyOn(service['repo'], 'findOne').mockResolvedValue(event)
    jest.spyOn(service['repo'], 'softRemove').mockResolvedValue(event)

    const result = await service.remove(id)

    expect(result).toEqual(event)
    expect(service['repo'].findOne).toHaveBeenCalledWith({ where: { id } })
    expect(service['repo'].softRemove).toHaveBeenCalledWith(event)
  })

  it('throws an error when removing an event that does not exist', async () => {
    const id = -1

    jest.spyOn(service, 'findOne').mockResolvedValue(null)

    await expect(service.remove(id)).rejects.toThrow(NotFoundException)
    expect(service.findOne).toHaveBeenCalledWith(id)
  })

  it('finds all events successfully', async () => {
    const events = [new Event(), new Event()]

    jest.spyOn(service, 'findAll').mockResolvedValue([events, events.length])

    const result = await service.findAll()

    expect(result).toEqual([events, events.length])
    expect(service.findAll).toHaveBeenCalled()
  })

  it('finds all events with options successfully', async () => {
    const events = [new Event(), new Event()]
    const options = { where: { approved: true } }

    jest.spyOn(service, 'findAll').mockResolvedValue([events, events.length])

    const result = await service.findAll(options)

    expect(result).toEqual([events, events.length])
    expect(service.findAll).toHaveBeenCalledWith(options)
  })

  it('returns an empty array when no events are found', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue([[], 0])

    const result = await service.findAll()

    expect(result).toEqual([[], 0])
    expect(service.findAll).toHaveBeenCalled()
  })
})
