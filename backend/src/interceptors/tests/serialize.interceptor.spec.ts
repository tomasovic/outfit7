import { Test, TestingModule } from '@nestjs/testing'

import { CallHandler, ExecutionContext } from '@nestjs/common'
import { lastValueFrom, of } from 'rxjs'
import { createMock } from '@golevelup/ts-jest'
import { SerializeInterceptor } from '../serialize.interceptor'

describe('SerializeInterceptor', () => {
  let interceptor: SerializeInterceptor

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SerializeInterceptor],
    }).compile()

    interceptor = module.get<SerializeInterceptor>(SerializeInterceptor)
  })

  it('transforms the result of the handler to a serialized format', async () => {
    const mockExecutionContext = createMock<ExecutionContext>()
    const mockCallHandler: Partial<CallHandler> = {
      handle: () => of({ foo: 'bar' }),
    }

    const result$ = interceptor.intercept(
      mockExecutionContext,
      mockCallHandler as CallHandler,
    )

    const result = await lastValueFrom(result$)

    expect(result).toEqual({ foo: 'bar' })
  })
})
