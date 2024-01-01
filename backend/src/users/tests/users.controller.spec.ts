import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from '../users.controller'
import { UsersService } from '../users.service'
import { AuthService } from '../../auth/auth.service'
import { User } from '../user.entity'
import { LoginUserDto } from '../dtos/login-user.dto'
import { NotFoundException } from '@nestjs/common'
import { UpdateUserDto } from '../dtos/update-user.dto'

describe('UsersController', () => {
  let controller: UsersController
  let fakeUsersService: Partial<UsersService>
  let fakeAuthService: Partial<AuthService>

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'asdf@asdf.com',
          password: 'asdf',
        } as User)
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'asdf' } as User])
      },
    }
    fakeAuthService = {
      signin: ({ email, password }: LoginUserDto) => {
        return Promise.resolve({ id: 1, email, password } as User)
      },
      signup: jest.fn().mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: 'asdf',
        admin: false,
      } as User),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('admin@outfit.com')
    expect(users.length).toEqual(1)
    expect(users[0].email).toEqual('admin@outfit.com')
  })

  it('findAllUsers returns an empty list if no users with the given email exist', async () => {
    fakeUsersService.find = () => Promise.resolve([])
    const users = await controller.findAllUsers('nonexistent@test.com')
    expect(users.length).toEqual(0)
  })

  it('findUser returns a user if user with given id exists', async () => {
    const user = { id: 1, email: 'test@test.com', password: 'asdf' } as User
    fakeUsersService.findOne = jest.fn().mockResolvedValue(user)

    const result = await controller.findUser('1')

    expect(result).toEqual(user)
    expect(fakeUsersService.findOne).toHaveBeenCalledWith(1)
  })

  it('findUser throws an error if user with given id does not exist', async () => {
    fakeUsersService.findOne = jest.fn().mockResolvedValue(null)

    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException)
  })

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 }
    const dto: LoginUserDto = { email: 'test@test.com', password: 'asdf' }
    const user = { id: 1, email: dto.email, password: dto.password } as User

    fakeAuthService.signin = jest.fn().mockResolvedValue(user)

    const result = await controller.signin(dto, session)

    expect(result).toEqual(user)
    expect(session.userId).toEqual(user.id)
    expect(fakeAuthService.signin).toHaveBeenCalledWith(dto)
  })

  it('createUser creates a new user and sets session.userId', async () => {
    const session = { userId: -10 }
    const dto = {
      email: 'test@test.com',
      password: 'asdf',
      countryCode: 'US',
    }
    const user = {
      id: 1,
      email: dto.email,
      password: dto.password,
    } as User

    fakeAuthService.signup = jest.fn().mockResolvedValue(user)

    const result = await controller.createUser(dto, session)

    expect(result).toEqual(user)
    expect(session.userId).toEqual(user.id)
    expect(fakeAuthService.signup).toHaveBeenCalledWith(dto)
  })

  it('whoAmI returns the current user', async () => {
    const user = { id: 1, email: 'test@test.com', password: 'asdf' } as User
    expect(await controller.whoAmI(user)).toEqual(user)
  })

  it('signOut sets session.userId to null', async () => {
    const session = { userId: 1 }
    controller.signOut(session)
    expect(session.userId).toBeNull()
  })

  it('removeUser removes a user if user with given id exists', async () => {
    const user = { id: 1, email: 'test@test.com', password: 'asdf' } as User
    fakeUsersService.remove = jest.fn().mockResolvedValue(user)

    const result = await controller.removeUser('1')

    expect(result).toEqual(user)
    expect(fakeUsersService.remove).toHaveBeenCalledWith(1)
  })

  it('removeUser throws an error if user with given id does not exist', async () => {
    fakeUsersService.remove = jest
      .fn()
      .mockRejectedValue(new NotFoundException('User was not found.'))

    await expect(controller.removeUser('1')).rejects.toThrow(NotFoundException)
  })

  it('updateUser updates a user if user with given id exists', async () => {
    const user = { id: 1, email: 'test@test.com', password: 'asdf' } as User
    const dto: UpdateUserDto = {
      email: 'new@test.com',
      password: 'newpass',
    } as UpdateUserDto
    fakeUsersService.update = jest.fn().mockResolvedValue({ ...user, ...dto })

    const result = await controller.updateUser('1', dto)

    expect(result).toEqual({ ...user, ...dto })
    expect(fakeUsersService.update).toHaveBeenCalledWith(1, dto)
  })

  it('updateUser throws an error if user with given id does not exist', async () => {
    const dto: UpdateUserDto = {
      email: 'new@test.com',
      password: 'newpass',
    } as UpdateUserDto
    fakeUsersService.update = jest
      .fn()
      .mockRejectedValue(new NotFoundException('User was not found.'))

    await expect(controller.updateUser('1', dto)).rejects.toThrow(
      NotFoundException,
    )
  })
})
