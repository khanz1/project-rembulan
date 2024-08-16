import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
type SignTokenPayload = Record<string, string | boolean | number | object>;

export const signToken = (payload: SignTokenPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};

export const verifyToken = <T>(token: string) => {
  return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & T;
};
