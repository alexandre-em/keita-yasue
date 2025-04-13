'use server';
import jsonwebtoken from 'jsonwebtoken';

type JaasJwtPayload = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  appId: string;
  kid: string;
  role: 'ADMIN' | 'USER';
};

/**
 * Function generates a JaaS JWT.
 */
export const generate = async ({ id, name, email, avatar, appId, kid, role }: JaasJwtPayload) => {
  const now = new Date();
  const privateKey = process.env['JITSI_PRIVATE_KEY'] || '';
  const jwt = jsonwebtoken.sign(
    {
      aud: 'jitsi',
      context: {
        user: {
          id,
          name,
          avatar,
          email,
          moderator: role === 'ADMIN' ? 'true' : 'false',
        },
        features: {
          livestreaming: 'true',
          recording: 'true',
          transcription: 'true',
          'outbound-call': 'true',
        },
      },
      iss: 'chat',
      room: '*',
      sub: appId,
      exp: Math.round(now.setHours(now.getHours() + 3) / 1000),
      nbf: Math.round(new Date().getTime() / 1000) - 10,
    },
    privateKey,
    { algorithm: 'RS256', header: { kid } } as { algorithm: 'RS256' }
  );
  return jwt;
};
