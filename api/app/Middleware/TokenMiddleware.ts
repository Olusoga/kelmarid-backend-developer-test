import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { TokenHelper } from 'App/Helpers/TokenHelper';

export default class TokenMiddleware {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const authHeader = request.header('Authorization');
   
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.unauthorized({ message: 'Token is missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = TokenHelper.verifyToken(token);

    if (!decoded) {
      return response.unauthorized({ message: 'Invalid or expired token' });
    }

    
    request.requestData = decoded;

    await next();
  }
}
