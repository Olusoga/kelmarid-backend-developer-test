import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import jwt from 'jsonwebtoken';
import Env from '@ioc:Adonis/Core/Env';
import User from "App/Models/User"
import Author from 'App/Models/Author';
import Database from '@ioc:Adonis/Lucid/Database';

export default class UsersController {
   
  public async create({ request, response }) {
    const { username, password } = request.only(['username', 'password']);
  
    const existingUser = await User.query().where('username', username).first();
  
    if (existingUser) {
      return response.unauthorized({ message: 'user already exist' });
    }
  
    const trx = await Database.transaction();
  
    try {
      const user = await User.create({ username, password }, { client: trx });
      const author = await Author.create({ userId: user.id }, { client: trx });
  
      await trx.commit();
  
      return { user, author };
    } catch (error) {
      await trx.rollback();
      return response.internalServerError({ message: 'An error occurred', error });
    }
  }
  

    public async login({ request, response }): Promise<HttpContextContract> {
        const { username, password } = request.only(['username', 'password']);
    
        const user = await User.query().where('username', username).first();
    
        if (!user) {
          return response.unauthorized({ message: 'Invalid credentials' });
        }
    
        const isPasswordValid = await Hash.verify(user.password, password);
    
        if (!isPasswordValid) {
          return response.unauthorized({ message: 'Invalid credentials' });
        }
    
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
          },
          Env.get('APP_KEY'),
          { expiresIn: '1h' } 
        );
    
        // Respond with the token
        return response.ok({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            name: user.username,
          },
        });
      }

}