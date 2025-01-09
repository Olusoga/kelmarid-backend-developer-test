import jwt from 'jsonwebtoken';
import Env from '@ioc:Adonis/Core/Env'

const SECRET_KEY = Env.get('APP_KEY'); 



export class TokenHelper {
  static generateToken(payload: object, expiresIn: string = '1h'): string {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
  }

  static verifyToken(token: string) {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return null;
    }
  }
}
