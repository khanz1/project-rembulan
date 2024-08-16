import { OAuth2Client } from 'google-auth-library';
import Config from '../config';
import { BadRequestError } from './http.error';

const client = new OAuth2Client();

export const verifyGoogleToken = async (googleToken: string) => {
  const ticket = await client.verifyIdToken({
    idToken: googleToken,
    audience: Config.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new BadRequestError('Invalid google token');
  }

  return payload;
};
