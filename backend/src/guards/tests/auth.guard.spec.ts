import { ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '../auth.guard'
import { Test } from '@nestjs/testing'
import { UsersService } from '../../users/users.service'

describe('AuthGuard', () => {
  let guard: AuthGuard

  beforeEach(async () => {
    const usersService = { findOne: jest.fn().mockResolvedValue({ id: 1 }) }

    const module = await Test.createTestingModule({
      providers: [AuthGuard, { provide: UsersService, useValue: usersService }],
    }).compile()

    guard = module.get<AuthGuard>(AuthGuard)
  })

  it('allows the request to proceed if the user is authenticated', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ session: { userId: 1 } }),
      }),
    } as unknown as ExecutionContext

    expect(guard.canActivate(context)).toBe(1)
  })

  it('rejects the request if the user is not authenticated', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ session: {} }),
      }),
    } as unknown as ExecutionContext

    expect(await guard.canActivate(context)).toBeUndefined()
  })
})
