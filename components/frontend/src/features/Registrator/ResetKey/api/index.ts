import { sendPOST } from 'src/shared/api'

async function resetKey(token: string, public_key: string): Promise<void> {
  await sendPOST('/v1/auth/reset-key', {token, public_key}, true)
}

export const api = {
  resetKey
}
