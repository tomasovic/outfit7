import { hashValue } from '../hash'
import * as crypto from 'crypto'
import { mocked } from 'jest-mock'

jest.mock('crypto')
jest.mock('util', () => ({
  promisify: jest
    .fn()
    .mockImplementation(() => () => Buffer.from(Math.random().toString())),
}))

describe('hashValue', () => {
  beforeEach(() => {
    mocked(crypto.randomBytes).mockImplementation(() =>
      Buffer.from(Math.random().toString()),
    )
  })

  it('should return a hashed value', async () => {
    const value = 'test'
    const hashedValue = await hashValue(value)
    expect(hashedValue).toContain('.')
    expect(hashedValue.split('.')).toHaveLength(2)
  }, 100000)

  it('should return a different hash for different values', async () => {
    const value1 = 'test1'
    const value2 = 'test2'
    const hashedValue1 = await hashValue(value1)
    const hashedValue2 = await hashValue(value2)
    expect(hashedValue1).not.toEqual(hashedValue2)
  }, 10000)

  it('should return a different hash for the same value', async () => {
    const value = 'test'
    const hashedValue1 = await hashValue(value)
    const hashedValue2 = await hashValue(value)
    expect(hashedValue1).not.toEqual(hashedValue2)
  }, 10000)

  it('should throw an error if crypto fails', async () => {
    const value = 'test'
    mocked(crypto.randomBytes).mockImplementation(() => {
      throw new Error('Crypto failed')
    })
    await expect(hashValue(value)).rejects.toThrow('Crypto failed')
  }, 10000)
})
