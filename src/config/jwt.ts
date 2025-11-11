import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import env from './env';

export interface JwtPayload {
  userId: number;
  role: string;
}

export const jwtConfig = {
  sign(payload: JwtPayload) {
    const options: SignOptions = {
      expiresIn: parseInt(env.JWT_EXPIRES_IN, 10)
    };
    return jwt.sign(payload, env.JWT_SECRET as Secret, options);
  },

  verify(token: string) {
    return jwt.verify(token, env.JWT_SECRET as Secret) as JwtPayload;
  }
};