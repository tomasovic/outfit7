![outfit.png](outfit.png)

# Outfit Coding Task

## Task Description

The text of this challenge can be found in the file `challenge.txt`.

### Warning ⚠️

- Challenge accepted!
- NestJS application
- Postgres DB
- VUE 3 with Vuetify
- Simplified RBAC

## Features

- **Login & Account Creation**: Securely log in or create a new account.
- **Events**: Users can view events.
- **Event Details**: Users can see event details.
- **Event Creation**: Users can create events. Admin event creation is approved by default.
- **Admin Approval**: Admins can approve, delete and edit events.
- **Admin Privileges**: You can be admin randomly depending of the response from the external API, or you can be
  admin tampering the DB 😊
- **Rate Limiter**: Rate limiter is set up to 10 requests per 3600ms. Configurable in the `.env` file.
- **Swagger**: Swagger docs are available at `http://localhost:3000/api`. No auth.
- **Tests**: Tests are available in the `tests` folder.
- **Docker**: Docker dev is available.
- **Seeders**: Seeders are available in the `commands` folder.
- **Helmet**: Helmet is set up for security.
- **HttpOnly Cookies**: Cookies are set up for security.
- **CORS**: CORS is set up for security.
- **Versioning** API versioning is set up. V1 is the default version.
- **Server side search and tables** filtering, sorting, paging, etc are done on the server side
- **Validation**: Validation is set up for all entities. Both for frontend and backend.
- **Error Handling**: Custom error filtering
- **Guards**: Guards are set up for all entities. Both for frontend and backend.
- **Interceptors**: exclude some fields from the response and getting current user
- **Customer Decorators**: custom decorator for current user
- **Custom response**

## Installation

1. **Install NodeJS**: LTS or the latest version.
2. **Install Docker**. Only if you want to start this project from the docker container.
3. **Setup the Project**:
    - In the root directory, run `npm install` ( if you dont want running it with docker ).
    - Run `docker compose up -d` to start Postgres and app. There will be three containers, one for the REST API,
      one for
      the dev postgres and one for the tests ( docker is available only for backend ).
    - I have left on purpose an `.env` in the project so you can use it to run or test the project

4. **Follow the next steps below**

## List of commands

- **package.json**: for both frontend and backend, you can find all the commands in the `package.json` files

## Database Configuration

- **Postgres Database**: Available at `http://localhost:5432`. Note: if you dont have docker, you will need to
  install Postgres locally and have it running on port 5432.
- **Postgres Database Test**: Accessible at `http://localhost:5433`. Note: if you dont have docker, you will need to
  install Postgres locally and have it running on port 5433. Used for testing.
- **Config details**: Config details are available in the `.env` file.
- **Fine tuning**: If you want some fine tuning `ormconfig.js` is exposed.

## Seed Data ⚠️ backend only

- You can populate the database with some seed data
- First user seed, after events seed
- There are two types of seeds per entity:
    - `seed:users` - creates users in the dev database
    - `seed:users:test` - creates users in the test database
    - `seed:events` - creates events in the dev database
    - `seed:events:test` - creates events in the test database
- User account info (password is qwe):
    - admin@outfit.com - this is admin password by default
    - the rest of the users are randomly created by the script
    - you can create your own user by registering upon starting the app
    - if you register user account by register form, admin privileges will be randomly assigned to you by the external
      API

## Development Environment

- Start the development server: `npm run start:dev` for the backend.
- Start the development server: `npm run dev` for the frontend.

## Testing the Application

- Run all tests with `npm run test` or `npm run test:e2e` for backend.
- Run all tests with `npm run test:unit` for frontend. Tests for frontend are not completely, but the components are
  tested.

## Server side Paging, Sorting and filtering

- These are the default values for sorting and filtering
- page: 1
- limit: 10, max: 100
- order: DESC
- sort: id
- filter - everything can be filtered, sorted and paged

#### Example

http://localhost:3000/v1/events?page=1&limit=10&order=asc&type=app

#### Wannabies

- Should be nice to have Redis for caching and rate limiting

#### Notes

- first time ever using VUE 3, so i am not sure if i did everything right, but this was challenge preferred way 🎸
