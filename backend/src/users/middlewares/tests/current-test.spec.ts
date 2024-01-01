import { Test, TestingModule } from '@nestjs/testing'
import { CurrentUserMiddleware } from '../current-user.middleware'
import { UsersService } from '../../users.service'
import { User } from '../../user.entity'

describe('CurrentUserMiddleware', () => {
  let middleware: CurrentUserMiddleware
  let usersService: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrentUserMiddleware,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile()

    middleware = module.get<CurrentUserMiddleware>(CurrentUserMiddleware)
    usersService = module.get<UsersService>(UsersService)
  })

  it('should set req.currentUser if session.userId is present', async () => {
    const user = new User()
    const req: any = { session: { userId: 1 } }
    const res: any = {}
    const next: any = jest.fn()

    jest.spyOn(usersService, 'findOne').mockResolvedValue(user)

    await middleware.use(req, res, next)

    expect(req.currentUser).toBe(user)
    expect(next).toHaveBeenCalled()
  })

  it('should not set req.currentUser if session.userId is not present', async () => {
    const req: any = { session: {} }
    const res: any = {}
    const next: any = jest.fn()

    await middleware.use(req, res, next)

    expect(req.currentUser).toBeUndefined()
    expect(next).toHaveBeenCalled()
  })

  it('should set req.currentUser if session.userId is present', async () => {
    const user = new User()
    const userId = 1
    const req: any = { session: { userId } }
    const res: any = {}
    const next: any = jest.fn()

    jest.spyOn(usersService, 'findOne').mockResolvedValue(user)

    await middleware.use(req, res, next)

    expect(req.currentUser).toBe(user)
    expect(usersService.findOne).toHaveBeenCalledWith(userId)
    expect(next).toHaveBeenCalled()
  })
})
