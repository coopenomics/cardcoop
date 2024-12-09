import { PrivateKey } from '@wharfkit/antelope';
import {
  ICreatedUser,
  IKeyPair,
  ISendStatement,
} from 'src/shared/lib/types/user';
import { sendPOST } from 'src/shared/api';
import { ICreateUser } from '../model';

async function createUser(data: ICreateUser): Promise<ICreatedUser> {
  const response = await sendPOST('/v1/users', data, true);

  return response;
}

async function sendStatement(data: ISendStatement): Promise<void> {
  await sendPOST('/v1/participants/join-cooperative', data);
}

async function emailIsExist(email: string): Promise<boolean> {
  //TODO verify email exists on backend
  console.log('check email before: ', email);
  return false;
}

function generateKeys(): IKeyPair {
  const private_key_data = PrivateKey.generate('K1');
  const public_key = private_key_data.toPublic().toString();
  const private_key = private_key_data.toWif();

  return {
    private_key,
    public_key,
  } as IKeyPair;
}

const generateUsername = (): string => {
  let result = '';

  const possible = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < 12; i++)
    result += possible.charAt(Math.floor(Math.random() * possible.length));

  //TODO check for not exist in blockchain

  return result;
};

export const api = {
  createUser,
  emailIsExist,
  generateUsername,
  generateKeys,
  sendStatement,
};
