import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'
import { AdsType } from '../types/shared.types'

@Injectable()
export class ExternalApiService {
  constructor(
    private httpServer: HttpService,
    private configService: ConfigService,
  ) {}

  async checkAdsTypePermission(countryCode: string): Promise<boolean> {
    try {
      const response$ = this.httpServer.get(
        this.configService.get('EXTERNAL_API'),
        {
          params: { countryCode },
          auth: {
            username: this.configService.get('EXTERNAL_API_USER'),
            password: this.configService.get('EXTERNAL_API_PASS'),
          },
        },
      )

      const {
        data: { ads },
        status,
      } = await lastValueFrom(response$)

      if (status !== 200) {
        return false
      }

      return ads === AdsType.Pass
    } catch (error) {
      return false
    }
  }
}
