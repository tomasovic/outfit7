import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from '../users.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from '../user.entity'
import { Repository } from 'typeorm'

describe('UsersService', () => {
  let service: UsersService
  let repo: Repository<User>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockImplementation((user) => user),
            save: jest.fn().mockResolvedValue(undefined),
            findOne: jest.fn().mockResolvedValue(undefined),
            find: jest.fn().mockResolvedValue(undefined),
            softRemove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    repo = module.get<Repository<User>>(getRepositoryToken(User))
  })

  it('create creates a new user and saves it to the repository', async () => {
    const user = {
      id: 1,
      email: 'test@test.com',
      password: 'asdf',
      admin: false,
    } as User
    const spyCreate = jest.spyOn(repo, 'create').mockReturnValue(user)
    const spySave = jest.spyOn(repo, 'save').mockResolvedValue(user)

    const result = await service.create(user.email, user.password, user.admin)

    expect(result).toEqual(user)
    expect(spyCreate).toHaveBeenCalledWith({
      email: user.email,
      password: user.password,
      admin: user.admin,
    })
    expect(spySave).toHaveBeenCalledWith(user)
  })

  it('findOne returns a user if user with given id exists', async () => {
    const user = { id: 1, email: 'test@test.com', password: 'asdf' } as User
    jest.spyOn(repo, 'findOne').mockResolvedValue(user)

    const result = await service.findOne(1)

    expect(result).toEqual(user)
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('findOne returns null if no id is provided', async () => {
    const result = await service.findOne(null)

    expect(result).toBeNull()
    expect(repo.findOne).not.toHaveBeenCalled()
  })

  it('findOne returns null if user with given id does not exist', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(null)

    const result = await service.findOne(1)

    expect(result).toBeNull()
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should update a user', async () => {
    const user = new User()
    jest.spyOn(repo, 'findOne').mockResolvedValue(user)
    const spy = jest.spyOn(repo, 'save').mockResolvedValue(user)

    expect(await service.update(1, { email: 'new@test.com' })).toEqual(user)
    expect(spy).toHaveBeenCalledWith({ ...user, email: 'new@test.com' })
  })

  it('should throw an error if user not found when updating', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(null)

    await expect(service.update(1, { email: 'new@test.com' })).rejects.toThrow(
      'User was not found.',
    )
  })

  it('should remove a user', async () => {
    const user = new User()
    jest.spyOn(repo, 'findOne').mockResolvedValue(user)
    const spy = jest.spyOn(repo, 'softRemove').mockResolvedValue(user)

    expect(await service.remove(1)).toEqual(user)
    expect(spy).toHaveBeenCalledWith(user)
  })

  it('should throw an error if user not found when removing', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(null)

    await expect(service.remove(1)).rejects.toThrow('User was not found.')
  })
})
