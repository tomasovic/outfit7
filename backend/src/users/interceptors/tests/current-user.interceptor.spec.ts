import { Test, TestingModule } from '@nestjs/testing'
import { CallHandler, ExecutionContext } from '@nestjs/common'
import { CurrentUserInterceptor } from '../current-user.interceptor'
import { UsersService } from '../../users.service'
import { User } from '../../user.entity'
import { createMock } from '@golevelup/ts-jest'
import { of } from 'rxjs'
import { Request } from 'express'

interface RequestWithUser extends Request {
  currentUser?: User
}

describe('CurrentUserInterceptor', () => {
  let interceptor: CurrentUserInterceptor
  let usersService: Partial<UsersService>

  beforeEach(async () => {
    usersService = {
      findOne: jest.fn().mockResolvedValue(new User()),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrentUserInterceptor,
        { provide: UsersService, useValue: usersService },
      ],
    }).compile()

    interceptor = module.get<CurrentUserInterceptor>(CurrentUserInterceptor)
  })

  it('sets request.currentUser if session.userId is present', async () => {
    const mockRequest = createMock<RequestWithUser>({ session: { userId: 1 } })
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    })
    const handler = createMock<CallHandler>({ handle: () => of(null) })

    await interceptor.intercept(context, handler)

    expect(mockRequest.currentUser).toBeDefined()
    expect(usersService.findOne).toHaveBeenCalledWith(1)
  })

  it('does not set request.currentUser if session.userId is not present', async () => {
    const mockRequest: RequestWithUser = { session: {} } as any
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    })
    const handler = createMock<CallHandler>({ handle: () => of(null) })

    await interceptor.intercept(context, handler)

    expect(mockRequest.currentUser).toBeUndefined()
    expect(usersService.findOne).not.toHaveBeenCalled()
  })
})
