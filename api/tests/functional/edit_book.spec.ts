import { test } from '@japa/runner';
import User from 'App/Models/User';
import Author from 'App/Models/Author';
import Book from 'App/Models/Book';
import Database from '@ioc:Adonis/Lucid/Database';
import { TokenHelper } from 'App/Helpers/TokenHelper';
import { generateRandomUsername } from 'App/Helpers/randomTestUser';

test.group('BooksController - Edit Book', (group) => {
    group.setup(async () => {
      await Database.beginGlobalTransaction();
    });
  
    group.teardown(async () => {
      await Database.rollbackGlobalTransaction();
    });

  test('should update a book successfully', async ({ client, assert }) => {
    
    const user = await User.create({
      username: 'test_user',
      password: 'securepassword',
    });

    const author = await Author.create({
      userId: user.id,
    });

    const book = await Book.create({
      name: 'Original Book Name',
      number_of_pages: 100,
      authorId: author.id,
    });

    const token = TokenHelper.generateToken({
          id: user.id,
          username: user.username,
        });
      
    const updateData = {
      name: 'Updated Book Name',
      number_of_pages: 120,
    };

    const response = await client
      .patch(`/books/${book.id}`)
      .header('Authorization', `Bearer ${token}`)
      .json(updateData);

  
    response.assertStatus(200);
    response.assertBodyContains({
      msg: 'Book updated successfully',
    });

    const updatedBook = await Book.find(book.id);
    assert.equal(updatedBook?.name, 'Updated Book Name');
    assert.equal(updatedBook?.number_of_pages, 120);
  });

  test('should not update a book without authorization', async ({ client }) => {
    const response = await client.patch('/books/1').json({
      name: 'Token is missing or invalid',
    });

    response.assertStatus(401);
    response.assertBodyContains({
      message: 'Token is missing or invalid',
    });
  });

  test('should not update a book if not owned by user', async ({ client }) => {
    const user_name = generateRandomUsername()
    const otherUser = await User.create({
      username: user_name,
      password: 'securepassword',
    });

    const otherAuthor = await Author.create({
      userId: otherUser.id,
    });

    const book = await Book.create({
      name: 'Other User Book',
      number_of_pages: 200,
      authorId: otherAuthor.id,
    });

    const token = 'mocked_token'; 

    const response = await client
      .patch(`/books/${book.id}`)
      .header('Authorization', `Bearer ${token}`)
      .json({
        name: 'Attempted Unauthorized Update',
      });

    // Assert: Verify the response
    response.assertStatus(401);
    response.assertBodyContains({
      message: 'Invalid or expired token',
    });
  });

  test('should not update a book if no data is provided', async ({ client }) => {
    const user_name =  generateRandomUsername();
    const user = await User.create({
      username: user_name,
      password: 'securepassword',
    });


    const author = await Author.create({
      userId: user.id,
    });

    const book = await Book.create({
      name: 'Original Book Name',
      number_of_pages: 100,
      authorId: author.id,
    });

     const token = TokenHelper.generateToken({
          id: user.id,
          username: user.username,
        });

  
    const response = await client
      .patch(`/books/${book.id}`)
      .header('Authorization', `Bearer ${token}`)
      .json({});


    response.assertStatus(400);
    response.assertBodyContains({
      message: 'No data to update',
    });
  });

  test('should return 404 if book does not exist', async ({ client }) => {
const user_name = generateRandomUsername();

    const user = await User.create({
      username: user_name,
      password: 'securepassword',
    });
    
    
    const token = TokenHelper.generateToken({
      id: user.id,
      username: user.username,
    });

    const response = await client
      .patch('/books/7ee9d040-987c-44ec-a058-be9efb2a1995')
      .header('Authorization', `Bearer ${token}`)
      .json({
        name: 'Non-existent Book',
      });

    response.assertStatus(404)
  });
});
