import { test } from '@japa/runner';
import User from 'App/Models/User';
import Author from 'App/Models/Author';
import { TokenHelper } from 'App/Helpers/TokenHelper';

test.group('AuthorsController - editAuthor', (group) => {
  let user: User;
  let author: Author;
  let token: string;

  group.setup(async () => {
   
    user = await User.create({
      username: 'john_doe',
      password: 'password123', 
    });

    
    author = await Author.create({
      userId: user.id,
    });


    token = TokenHelper.generateToken({
      id: user.id,
      username: user.username,
    });
  });

  test('should successfully edit author when token is valid and user is authorized', async ({ client }) => {
    const response = await client
      .put(`/authors/${author.id}`)
      .header('Authorization', `Bearer ${token}`)
      .json({ username: 'john_updated' });

    response.assertStatus(200);
    response.assertBodyContains({
      "msg": "author updated successfully",
    });
  });

  test('should return 403 when user tries to edit another author', async ({ client }) => {
    const anotherUser = await User.create({
      username: 'jane_doe',
      password: 'password123',
    });

    const anotherAuthor = await Author.create({
      userId: anotherUser.id,
    });

    const response = await client
      .put(`/authors/${anotherAuthor.id}`)
      .header('Authorization', `Bearer ${token}`)
      .json({ username: 'jane_updated' });

    response.assertStatus(403);
    response.assertBodyContains({
      message: 'You are not authorized to edit this author',
    });
  });

  test('should return 401 when token is missing', async ({ client }) => {
    const response = await client
      .put(`/authors/${author.id}`)
      .json({ username: 'john_updated' });

    response.assertStatus(401);
    response.assertBodyContains({
      message: 'Token is missing or invalid',
    });
  });

  test('should return 401 when token is invalid', async ({ client }) => {
    const response = await client
      .put(`/authors/${author.id}`)
      .header('Authorization', 'Bearer invalid_token')
      .json({ username: 'john_updated' });

    response.assertStatus(401);
    response.assertBodyContains({
      message: 'Invalid or expired token',
    });
  });
});
