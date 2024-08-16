import User from '../../db/models/user.model';

interface FindOrCreateUserPayload {
  name: string;
  email: string;
}

export const findOrCreateUser = async (payload: FindOrCreateUserPayload) => {
  const [user, created] = await User.findOrCreate({
    where: {
      email: payload.email,
    },
    defaults: {
      name: payload.name || 'unknown',
      email: payload.email,
    },
  });

  return { user, created };
};
