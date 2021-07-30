import { Controller, EmailValidator, HttpRequest, HttpResponse, AddAccount } from './signup-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { ok, badRequest, serverError } from '../../helpers/http-helper'

export class SignupController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  // ts-disable-next-line
  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}
