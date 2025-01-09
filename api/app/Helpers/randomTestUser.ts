export function generateRandomUsername(): string {
    const prefix: string = 'user_';
    const randomNumber: number = Math.floor(Math.random() * 100000); 
    return `${prefix}${randomNumber}`;
  }