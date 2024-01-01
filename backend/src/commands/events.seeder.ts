import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app/app.module'
import { EventsService } from '../events/events.service'
import { randomInt } from 'crypto'
import { faker } from '@faker-js/faker'
import { EventType } from '../types/shared.types'

import { UsersService } from '../users/users.service'
;(async () => {
  const app = await NestFactory.createApplicationContext(AppModule)
  const eventService = app.get(EventsService)
  const userService = app.get(UsersService)

  for (let i = 0; i < 100; i++) {
    const user = await userService.findOne(randomInt(1, 10))
    const type = Object.values(EventType)[randomInt(0, 3)]

    await eventService.create(
      {
        name: 'click-event',
        description: faker.commerce.productDescription(),
        type,
        priority: randomInt(1, 10),
        approved: i % 3 === 0,
      },
      user,
    )
  }

  process.exit()
})()
