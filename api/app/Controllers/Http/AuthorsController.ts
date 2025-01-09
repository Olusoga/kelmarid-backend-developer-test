import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Author from 'App/Models/Author'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'

export default class AuthorsController {

  public async fetchAuthor({ request }) {
    const { page = 1, search = '' } = request.qs()

    const authors = await Database.from('authors')
      .select(
        'authors.*',
        'users.username',
        Database.raw('COALESCE(COUNT(books.id), 0) as number_of_books')
      )
      .leftJoin('users', 'authors.user_id', 'users.id')
      .leftJoin('books', 'authors.id', 'books.author_id')
      .where('users.username', 'like', `%${search}%`)
      .groupBy('authors.id', 'users.username')
      .paginate(page, 10)

    return authors
  }

  public async editAuthor({ request, params, response }: HttpContextContract) {
    const username = request.body().username

  
    const author = await Author.findOrFail(params.id)

    
    if (author.userId !== request.requestData.id) {
      return response.forbidden({ message: 'You are not authorized to edit this author' })
    }

    const user = await User.findOrFail(author.userId)

    user.merge({ username })
    await user.save()

    return { msg:"author updated successfully" }
  }

  
  public async deleteAuthor({ params, response, request }: HttpContextContract) {
    const author = await Author.findOrFail(params.id)


    if (author.userId !== request.requestData.id) {
      return response.forbidden({ message: 'You are not authorized to delete this author' })
    }

    const user = await User.findOrFail(author.userId)

    await user.delete()
    await author.delete()

    return response.noContent()
  }
}
