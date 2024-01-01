import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { CreateUserDto } from '../src/users/dtos/create-user.dto'
import { LoginUserDto } from '../src/users/dtos/login-user.dto'
import { INestApplication } from '@nestjs/common'
import { AppModule } from '../src/app/app.module'
import { DataSource } from 'typeorm'
import { truncateAll } from './utils/db'

xdescribe('Auth E2E Tests', () => {
  let app: INestApplication
  let dataSource: DataSource
  let adminUser: { id: string; email: string; admin: boolean }
  let officeUser: { id: string; email: string; admin: boolean }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()

    dataSource = app.get(DataSource)
    await app.init()
  })

  afterEach(async () => {
    // await truncateAll(dataSource);
  })

  it('/auth/signup (POST) - success', async () => {
    const createUserDto: CreateUserDto = {
      email: 'admin@outfit.com',
      password: 'qwe',
      countryCode: 'SI',
    }

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(createUserDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.email).toEqual(createUserDto.email)
      })

    adminUser = response.body

    return response
  })

  it('/auth/signin (POST) - success', async () => {
    const loginUserDto: LoginUserDto = {
      email: 'admin@outfit.com',
      password: 'qwe',
    }

    await request(app.getHttpServer()).post('/auth/signup').send(loginUserDto)

    return request(app.getHttpServer())
      .post('/auth/signin')
      .send(loginUserDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.email).toEqual(loginUserDto.email)
      })
  })

  it('signup as a new user then get the currently logged in user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'office@outfit.com',
      password: 'qwe',
      countryCode: 'SI',
    }

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(createUserDto)
      .expect(201)

    officeUser = response.body

    const cookie = response.get('set-cookie')

    request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toEqual(createUserDto.email)
      })
  })

  it('/auth/:id (GET) - success', async () => {
    return request(app.getHttpServer())
      .get(`/auth/${adminUser.id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(adminUser)
      })
  })

  it('/auth/:id (DELETE) - success', async () => {
    return request(app.getHttpServer())
      .delete(`/auth/${adminUser.id}`)
      .expect(200)
  })

  it('/auth/:id (PATCH) - success', async () => {
    const updateUserDto: { email: string } = {
      email: 'tom@outfit.com',
    }

    return request(app.getHttpServer())
      .patch(`/auth/${officeUser.id}`)
      .send(updateUserDto)
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toEqual(updateUserDto.email)
      })
  })

  afterAll(async () => {
    await truncateAll(dataSource)
    await app.close()
  })
})
