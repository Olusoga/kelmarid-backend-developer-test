import { test } from '@japa/runner'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

test.group('UsersController.login', (group) => {
  group.each.teardown(async () => {
    await User.query().delete()
  })

  test('should log in successfully with valid credentials', async ({ client, assert }) => {
    const payload = { username: 'validuser', password: 'securepassword' }
    await User.create({ username: payload.username, password: payload.password })

    const response = await client.post('/login').json(payload)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Login successful',
      token: response.body().token,
      user: { 
        name: payload.username },
    })

    assert.isNotNull(response.body().token, 'Token should be present in the response')
  })

  test('should return an error for non-existent user', async ({ client }) => {
    const payload = { username: 'nonexistentuser', password: 'securepassword' }

    const response = await client.post('/login').json(payload)

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Invalid credentials' })
  })

  test('should return an error for invalid password', async ({ client }) => {
    const payload = { username: 'validuser', password: 'securepassword' }
    const hashedPassword = await Hash.make('differentpassword')

   
    await User.create({ username: payload.username, password: hashedPassword })

    const response = await client.post('/login').json(payload)

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Invalid credentials' })
  })
})
