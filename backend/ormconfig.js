require('dotenv').config()

var dbConfig = {
  // TODO: Remove synchronize before production
  synchronize: true,
  type: 'postgres',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
}

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      entities: ['**/*.entity.js'],
    })
    break
  case 'seed':
    Object.assign(dbConfig, {
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      entities: ['**/*.entity.ts'],
    })
    break
  case 'test':
    Object.assign(dbConfig, {
      database: process.env.DB_NAME_TEST,
      host: process.env.DB_HOST_TEST,
      port: process.env.DB_PORT_TEST,
      entities: ['**/*.entity.ts'],
      // migrationsRun: true,
    })
    break
  case 'production':
    break
  default:
    throw new Error('unknown environment')
}

console.log(dbConfig)

module.exports = dbConfig
