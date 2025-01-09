import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Author from 'App/Models/Author'
import User from 'App/Models/User'
import Book from 'App/Models/Book'
import { DateTime } from 'luxon'

export default class UserAuthorBookSeeder extends BaseSeeder {
  public async run () {
    
    const user = await User.create({
      username: 'test_user',
      password: 'password123',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    
    const author = await Author.create({
      userId: user.id,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    await Book.createMany([
      {
        name: 'The Great Gatsby',
        number_of_pages: 218,
        authorId: author.id,
      },
      {
        name: '1984',
        number_of_pages: 328,
        authorId: author.id,
      },
      {
        name: 'Atomic habits',
        number_of_pages: 300,
        authorId: author.id,
      },
      {
        name: '8 Laws of Power',
        number_of_pages: 425,
        authorId: author.id,
      },
      {
        name: 'Cruel Judgement',
        number_of_pages: 547,
        authorId: author.id,
      },
    ])
  }
}
