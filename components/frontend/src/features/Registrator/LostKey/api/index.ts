import { sendPOST } from 'src/shared/api'

async function lostKeyRequest(email: string): Promise<void> {
  await sendPOST('/v1/auth/lost-key', {email}, true)
}

export const api = {
  lostKeyRequest
}
