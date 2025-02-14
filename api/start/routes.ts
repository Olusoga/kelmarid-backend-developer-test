/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('/users', 'UsersController.create')
  Route.post('/login', 'UsersController.login')
})

Route.group(() => {
  Route.get('authors', 'AuthorsController.fetchAuthor')
  Route.put('authors/:id', 'AuthorsController.editAuthor').middleware(['token'])
  Route.delete('authors/:id', 'AuthorsController.deleteAuthor').middleware(['token'])
})

Route.group(() => {
  Route.get('/books', 'BooksController.fetch')
  Route.patch('/books/:id', 'BooksController.edit').middleware(['token'])
})
