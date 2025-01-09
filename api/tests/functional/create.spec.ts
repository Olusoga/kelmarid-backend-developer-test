import { test } from '@japa/runner'
import User from 'App/Models/User'
import Author from 'App/Models/Author'

test.group('UsersController.create', (group) => {
  group.each.teardown(async () => {
    // Clean up database after each test
    await User.query().delete()
    await Author.query().delete()
  })

  test('should create a user and author successfully', async ({ client, assert }) => {
    const payload = { username: 'newuser', password: 'securepassword' }

    const response = await client.post('/users').json(payload)

    response.assertStatus(200)
    response.assertBodyContains({
      user: { username: payload.username },
      author: {
        id: response.body().author.id,
        user_id: response.body().user.id,
        created_at: response.body().author.created_at,
        updated_at: response.body().author.updated_at,
      },
    })

    const user = await User.findBy('username', payload.username)
    assert.isNotNull(user, 'User should exist in the database')

    const author = await Author.findBy('userId', user?.id)
    assert.isNotNull(author, 'Author should be associated with the user')
  })

  test('should return an error if the user already exists', async ({ client }) => {
    const payload = { username: 'existinguser', password: 'securepassword' }


    await User.create(payload)

    const response = await client.post('/users').json(payload)

    response.assertStatus(401)
    response.assertBodyContains({ message: 'user already exist' })
  })
})
