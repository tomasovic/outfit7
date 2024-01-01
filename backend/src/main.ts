import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { ThrottlerGuard } from '@nestjs/throttler'
import helmet from 'helmet'
import { VersioningType } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { filters } from './exceptions/filters'

const swaggerConfig = new DocumentBuilder()
  .setTitle('Outfit 7 Analytics API')
  .setDescription('The Analytics API for mobile events')
  .setVersion('1.0')
  .addTag('mobile')
  .build()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  ;(app as any).set('etag', false)
  app.use((req, res, next) => {
    res.removeHeader('x-powered-by')
    res.removeHeader('date')
    next()
  })
  app.useGlobalGuards(app.get(ThrottlerGuard))
  app.useGlobalFilters(...filters)
  app.use(helmet())
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  })
  app.enableCors({
    origin: [
      'http://localhost:3333',
      'http://localhost:3000',
    ],
    credentials: true,
  });

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, document)

  await app.listen(3000)
}

bootstrap()
