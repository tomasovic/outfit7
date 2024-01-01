import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '../src/app/app.module'
import { DataSource } from 'typeorm'
import { CreateUserDto } from '../src/users/dtos/create-user.dto'
import { CreateEventDto } from '../src/events/dtos/create-event.dto'
import { EventType } from '../src/types/shared.types'
import { Event } from '../src/events/event.entity'
import { truncateAll } from './utils/db'
import { ApproveEventDto } from '../src/events/dtos/approve-event.dto'

describe('Events E2E Tests', () => {
  let app: INestApplication
  let dataSource: DataSource
  let eventUser: any
  let event: Event

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()

    dataSource = app.get(DataSource)
    await app.init()
  })

  it('/events (GET) - success', async () => {
    const createUserDto: CreateUserDto = {
      email: 'event@outfit.com',
      password: 'qwe',
      countryCode: 'SI',
    }

    const newUser = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(createUserDto)
      .expect(201)

    eventUser = newUser.body

    const loggedIn = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: createUserDto.email, password: createUserDto.password })
      .expect(201)

    const cookie = loggedIn.get('set-cookie')

    await request(app.getHttpServer())
      .get('/events')
      .set('Cookie', cookie)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true)

        if (res.body.length > 0) {
          const event = res.body[0]
          expect(event).toHaveProperty('id')
          expect(event).toHaveProperty('name')
          expect(event).toHaveProperty('type')
        }
      })
  })

  it('/events (POST) - success', async () => {
    const createEventDto: CreateEventDto = {
      name: 'event',
      description: 'event description',
      type: EventType.Ads,
      priority: 5,
      approved: true,
    }
    const loggedIn = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: eventUser.email,
        password: 'qwe',
      })
      .expect(201)

    const cookie = loggedIn.get('set-cookie')

    const newEvent = await request(app.getHttpServer())
      .post('/events')
      .send(createEventDto)
      .set('Cookie', cookie)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('name')
        expect(res.body).toHaveProperty('type')
      })

    event = newEvent.body
  })

  it('/events/:id (GET) - success', async () => {
    await request(app.getHttpServer())
      .get(`/events/${event.id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(event.id)
        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('name')
        expect(res.body).toHaveProperty('type')
      })
  })

  it('/events/:id (PATCH) - approve event success', async () => {
    const updateEventDto: ApproveEventDto = {
      approved: true,
    }

    if (eventUser.admin === false) {
      await request(app.getHttpServer())
        .patch(`/auth/${eventUser.id}`)
        .send({ admin: true })
        .expect(200)
    }

    const loggedIn = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: eventUser.email,
        password: 'qwe',
      })
      .expect(201)

    const cookie = loggedIn.get('set-cookie')

    await request(app.getHttpServer())
      .patch(`/events/${event.id}`)
      .send(updateEventDto)
      .set('Cookie', cookie)
      .expect(200)
      .expect((res) => {
        expect(res.body.approved).toBe(true)
      })
  })

  it('event/:id (PATCH) - success', async () => {
    const updateEventDto: { name: string } = {
      name: 'new event name',
    }

    if (eventUser.admin === false) {
      await request(app.getHttpServer())
        .patch(`/auth/${eventUser.id}`)
        .send({ admin: true })
        .expect(200)
    }

    const loggedIn = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: eventUser.email,
        password: 'qwe',
      })
      .expect(201)

    const cookie = loggedIn.get('set-cookie')

    await request(app.getHttpServer())
      .patch(`/events/event/${event.id}`)
      .send(updateEventDto)
      .set('Cookie', cookie)
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe('new event name')
      })
  })

  it('/:id (DELETE) - success', async () => {
    if (eventUser.admin === false) {
      await request(app.getHttpServer())
        .patch(`/auth/${eventUser.id}`)
        .send({ admin: true })
        .expect(200)
    }

    const loggedIn = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: eventUser.email,
        password: 'qwe',
      })
      .expect(201)

    const cookie = loggedIn.get('set-cookie')

    await request(app.getHttpServer())
      .delete(`/events/${event.id}`)
      .set('Cookie', cookie)
      .expect(200)
  })

  afterAll(async () => {
    await truncateAll(dataSource)
    await app.close()
  })
})
