import Database from "@ioc:Adonis/Lucid/Database"
import Author from "App/Models/Author"
import Book from "App/Models/Book"

export default class BooksController {
  public async fetch({ request }) {
    const { page = 1, search = '' } = request.qs()
  
    const books = await Database.from('books')
      .select(
        'books.*',
        Database.raw("STRING_AGG(users.username, ', ') as authors")
      )
      .leftJoin('authors', 'books.author_id', 'authors.id')  
      .leftJoin('users', 'authors.user_id', 'users.id')  
      .where('books.name', 'like', `%${search}%`)
      .orWhere('users.username', 'like', `%${search}%`) 
      .groupBy('books.id')
      .paginate(page, 10)
  
    return books
  }

  public async edit({ request, params, response }) {
    const name = request.body().name
    const number_of_pages = request.body().number_of_pages
    
  
    const requestData = request.requestData;
  
    if (!requestData) {
      return response.unauthorized({ message: 'Unauthorized request' });
    }
  
    const book = await Book.findOrFail(params.id);
   
    const author = await Author.findOrFail(book.authorId);
    if (author.userId !== requestData.id) {
      return response.unauthorized({ message: 'You are not authorized to edit this book.' });
    }
  

    if (!name && !number_of_pages) {
      return response.badRequest({ message: 'No data to update' });
    }
  
    const updateData: any = {};
    if (name) updateData.name = name;
    if (number_of_pages) updateData.number_of_pages = number_of_pages;
  
    const update = await Book.query()
      .where('id', params.id)
      .update(updateData);
  
    if (!update) {
      return response.notFound({ message: 'Book not found or no changes detected' });
    }
  
     await Book.findOrFail(params.id);
    return {msg : "Book updated successfully"}
  }
  
}