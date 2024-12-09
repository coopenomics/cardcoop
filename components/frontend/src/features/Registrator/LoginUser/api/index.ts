import { Bytes, Checksum256, PrivateKey } from '@wharfkit/session';
import { getBlockchainInfo, sendPOST } from 'src/shared/api';
import { ICreatedUser } from 'src/shared/lib/types/user';


async function loginUser(email: string, wif: string): Promise<ICreatedUser> {
  const now = (await getBlockchainInfo()).head_block_time.toString()

  const privateKey = PrivateKey.fromString(wif)
  const bytes = Bytes.fromString(now, 'utf8')
  const checksum = Checksum256.hash(bytes)
  const signature = privateKey.signDigest(checksum)
  const response = await sendPOST('/v1/auth/login', {email, now, signature}, true);
;
  return response;
}

export const api = {
  loginUser,
};
