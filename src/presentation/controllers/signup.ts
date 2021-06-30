import { HttpRequest, HttpResponse } from '../protocols/http'
import MissingParamError from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import Controller from '../protocols/controller'

export class SignupController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
