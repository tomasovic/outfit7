import { BadRequestException, Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { ExternalApiService } from '../external/external-api.service'
import { CreateUserDto } from '../users/dtos/create-user.dto'
import { LoginUserDto } from '../users/dtos/login-user.dto'
import { scrypt as _scrypt } from 'crypto'
import { promisify } from 'util'
import { hashValue } from '../utils/hash'

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private externalApiService: ExternalApiService,
  ) {}

  async signup(body: CreateUserDto) {
    const { email, password, countryCode } = body
    const users = await this.usersService.find(email)
    if (users.length) {
      throw new BadRequestException('Email is in use.')
    }

    const hashedPassword = await hashValue(password)
    const admin =
      await this.externalApiService.checkAdsTypePermission(countryCode)

    return await this.usersService.create(email, hashedPassword, admin)
  }

  async signin(body: LoginUserDto) {
    const { email, password } = body
    const [user] = await this.usersService.find(email)
    if (!user) {
      throw new BadRequestException('Credentials are not valid.')
    }

    const [salt, storedHash] = user.password.split('.')
    const hash = (await scrypt(password, salt, 32)) as Buffer

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Credentials are not valid.')
    }

    return user
  }
}
