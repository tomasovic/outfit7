import { Test } from '@nestjs/testing'
import { AuthService } from '../auth.service'
import { UsersService } from '../../users/users.service'
import { User } from '../../users/user.entity'
import { CreateUserDto } from '../../users/dtos/create-user.dto'
import { ExternalApiService } from '../../external/external-api.service'
import { BadRequestException } from '@nestjs/common'

describe('AuthService', () => {
  let service: AuthService
  let fakeUsersService: Partial<UsersService>
  let fakeExternalApiService: Partial<ExternalApiService>
  let body: CreateUserDto

  beforeEach(async () => {
    body = {
      email: 'admin@outfit7.com',
      password: 'asdasd',
      countryCode: 'SI',
    }

    const users: User[] = []
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email)
        return Promise.resolve(filteredUsers)
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User
        users.push(user)
        return Promise.resolve(user)
      },
    }

    fakeExternalApiService = {
      checkAdsTypePermission: () => Promise.resolve(true),
    }

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: ExternalApiService,
          useValue: fakeExternalApiService,
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined()
  })

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup(body)

    expect(user.password).not.toEqual('asdf')
    const [salt, hash] = user.password.split('.')
    expect(salt).toBeDefined()
    expect(hash).toBeDefined()
  })

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup(body)
    await expect(service.signup(body)).rejects.toThrow(BadRequestException)
  })

  it('throws if signin is called with an unused email', async () => {
    await expect(service.signin(body)).rejects.toThrow(BadRequestException)
  })

  it('throws if an invalid password is provided', async () => {
    await service.signup(body)
    body.password = 'wrongPassword'
    await expect(service.signin(body)).rejects.toThrow(BadRequestException)
  })

  it('returns a user if correct password is provided', async () => {
    await service.signup(body)

    const user = await service.signin(body)
    expect(user).toBeDefined()
  })
})
