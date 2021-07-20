import { HttpRequest, HttpResponse } from '../protocols/http'
import MissingParamError from '../errors/missing-param-error'
import EmailValidator from '../protocols/email-validator'
import { badRequest, serverError } from '../helpers/http-helper'
import Controller from '../protocols/controller'
import InvalidParamError from '../errors/invalid-param-error'

export class SignupController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (!this.emailValidator.isValid(httpRequest.body.email)) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}
