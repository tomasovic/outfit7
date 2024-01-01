import { NotFoundException } from '@nestjs/common'
import { NotFoundExceptionFilter } from '../not-found-exception.filter'

describe('NotFoundExceptionFilter', () => {
  it('should handle NotFoundException', () => {
    const filter = new NotFoundExceptionFilter()

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    const exception = new NotFoundException('Resource not found.')
    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => ({ url: '/test-url' }),
      }),
    } as any

    filter.catch(exception, host)

    expect(response.status).toHaveBeenCalledWith(exception.getStatus())
    expect(response.json).toHaveBeenCalledWith({
      statusCode: exception.getStatus(),
      timestamp: expect.any(String),
      path: '/test-url',
      message: 'Resource not found.',
    })
  })

  it('should use default message if NotFoundException has no custom message', () => {
    const filter = new NotFoundExceptionFilter()

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    const exception = new NotFoundException()
    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => ({ url: '/test-url' }),
      }),
    } as any

    filter.catch(exception, host)

    expect(response.status).toHaveBeenCalledWith(exception.getStatus())
    expect(response.json).toHaveBeenCalledWith({
      statusCode: exception.getStatus(),
      timestamp: expect.any(String),
      path: '/test-url',
      message: exception.message,
    })
  })
})
