import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Author from 'App/Models/Author'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class UserSeeder extends BaseSeeder {
  public async run() {
   const user =  await User.create({
      username: 'test_user',
      password: 'password123',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    await Author.create({
      userId: user.id, 
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),

      
    })
  }
}
