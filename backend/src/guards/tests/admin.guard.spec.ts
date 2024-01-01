import { Test } from '@nestjs/testing'
import { ExecutionContext } from '@nestjs/common'
import { AdminGuard } from '../admin.guard'

describe('AdminGuard', () => {
  let guard: AdminGuard

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AdminGuard],
    }).compile()

    guard = module.get<AdminGuard>(AdminGuard)
  })

  it('allows the request to proceed if the user is an admin', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ currentUser: { admin: true } }),
      }),
    } as unknown as ExecutionContext

    expect(await guard.canActivate(context)).toBe(true)
  })

  it('rejects the request if the user is not an admin', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ currentUser: { admin: false } }),
      }),
    } as unknown as ExecutionContext

    expect(await guard.canActivate(context)).toBe(false)
  })

  it('rejects the request if there is no user', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ currentUser: null }),
      }),
    } as unknown as ExecutionContext

    expect(await guard.canActivate(context)).toBe(false)
  })
})
