import { SignupController } from './signup'
import MissingParamError from '../errors/missing-param-error'
import InvalidParamError from '../errors/invalid-param-error'
import ServerError from '../errors/server-error'
import EmailValidator from '../protocols/email-validator'

interface SutTypes {
  sut: SignupController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignupController(emailValidatorStub)

  return { sut, emailValidatorStub }
}

describe('Sugnup Controller', () => {
  test('Should returns 400 if no name is provide', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password_123',
        passwordConfirmation: 'any_password_123'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissingParamError('name')
    )
  })

  test('Should returns 400 if no email is provide', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password_123',
        passwordConfirmation: 'any_password_123'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissingParamError('email')
    )
  })

  test('Should returns 400 if no password is provide', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password_123'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissingParamError('password')
    )
  })

  test('Should returns 400 if no password confirmation is provide', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password_123'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    )
  })

  test('Should returns 400 if an invalid email is provide', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid')
      .mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password_123',
        passwordConfirmation: 'any_password_123'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new InvalidParamError('email')
    )
  })

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password_123',
        passwordConfirmation: 'any_password_123'
      }
    }

    sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should returns 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid')
      .mockImplementation(() => {
        throw new Error()
      })

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password_123',
        passwordConfirmation: 'any_password_123'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(
      new ServerError()
    )
  })
})
