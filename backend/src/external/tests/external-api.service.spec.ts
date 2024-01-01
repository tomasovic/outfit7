import { Test } from '@nestjs/testing'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { of } from 'rxjs'
import { AdsType } from '../../types/shared.types'
import { ExternalApiService } from '../external-api.service'

describe('ExternalApiService', () => {
  let service: ExternalApiService
  let httpService: HttpService
  let configService: ConfigService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ExternalApiService,
        { provide: HttpService, useValue: { get: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile()

    service = module.get<ExternalApiService>(ExternalApiService)
    httpService = module.get<HttpService>(HttpService)
    configService = module.get<ConfigService>(ConfigService)
  })

  it('returns true if the external API response status is 200 and ads type is Pass', async () => {
    jest.spyOn(httpService, 'get').mockReturnValue(
      of({
        data: { ads: AdsType.Pass },
        status: 200,
      } as any),
    )

    expect(await service.checkAdsTypePermission('US')).toBe(true)
  })

  it('returns false if the external API response status is not 200', async () => {
    jest.spyOn(httpService, 'get').mockReturnValue(
      of({
        data: { ads: AdsType.Pass },
        status: 400,
      } as any),
    )

    expect(await service.checkAdsTypePermission('US')).toBe(false)
  })

  it('returns false if the external API response ads type is not Pass', async () => {
    jest.spyOn(httpService, 'get').mockReturnValue(
      of({
        data: { ads: AdsType.NoPass },
        status: 200,
      } as any),
    )

    expect(await service.checkAdsTypePermission('US')).toBe(false)
  })
})
