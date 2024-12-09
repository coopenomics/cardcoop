import { sendPOST } from 'src/shared/api';
import { ICreatedUser } from 'src/shared/lib/types/user';
import { hashSHA256 } from 'src/shared/api/crypto';

async function loginUser(username: string, wif: string): Promise<ICreatedUser> {
  const password = await hashSHA256(wif);

  const data = {
    username,
    password,
  };

  const response = await sendPOST('/v1/auth/login', data, true);

  console.log('response: ', response);
  return response;
}

export const api = {
  loginUser,
};
