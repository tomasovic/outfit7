import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app/app.module'
import { UsersService } from '../users/users.service'
import { hashValue } from '../utils/hash'

import { faker } from '@faker-js/faker'
;(async () => {
  const app = await NestFactory.createApplicationContext(AppModule)

  const usersService = app.get(UsersService)
  const password = await hashValue('qwe')

  await usersService.create('admin@outfit.com', password, true)

  for (let i = 0; i < 10; i++) {
    await usersService.create(faker.internet.email(), password, i % 3 === 0)
  }

  process.exit()
})()
