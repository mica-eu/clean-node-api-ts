import { SignupController } from './signup'

describe('Sugnup Controller', () => {
  test('Should returns 400 if no name is provide', () => {
    const sut = new SignupController()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password_123',
        passwordConfirmation: 'any_password_123'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
  })
})
