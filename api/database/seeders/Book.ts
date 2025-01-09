import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Book from 'App/Models/Book'

export default class BookSeeder extends BaseSeeder {
  public async run () {
   
    await Book.createMany([
      {
        name: 'The Great Gatsby',
        number_of_pages: 218,
        authorId: 'f60e74e8-1df0-457c-981d-c60457df9afd',
      },
      {
        name: '1984',
        number_of_pages: 328,
        authorId: 'f60e74e8-1df0-457c-981d-c60457df9afd',
      },

      {
        name: 'Atomic habits',
        number_of_pages: 300,
        authorId: 'f60e74e8-1df0-457c-981d-c60457df9afd',
      },

      {
        name: '8 laws of power',
        number_of_pages: 425,
        authorId: 'f60e74e8-1df0-457c-981d-c60457df9afd',
      },

      {
        name: 'Cruel Judgement',
        number_of_pages: 547,
        authorId: 'f60e74e8-1df0-457c-981d-c60457df9afd',
      },
    ])
  }
  }

