import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: Exception, ctx: HttpContextContract) {
    if (error.status === 422) {
      return ctx.response.status(error.status).send({
        code: 'BAD_REQUEST',
        message: error.message,
        status: error.status,
        errors: error['messages']?.error ? error['messages'].errors : '',
      })
    } else if (error.code === 'E_ROW_NOT_FOUND') {
      return ctx.response.status(error.status).send({
        code: 'BAD_REQUEST',
        message: 'resource not found',
        status: 404,
      })
    } else if (['E_INVALID_AUTH_UID', 'E_INVALID_AUTH_PASSWORD'].includes(error.code || '')) {
      return ctx.response.status(error.status).send({
        code: 'BAD_REQUEST',
        message: 'invalid credentials',
        status: 400,
      })
    }

    return super.handle(error, ctx)
  }
}
