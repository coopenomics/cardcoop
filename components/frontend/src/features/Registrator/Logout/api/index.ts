import { sendPOST } from 'src/shared/api'

async function logoutUser(refreshToken: string): Promise<void> {
  const data = {
    refreshToken,
  }

  const response = await sendPOST('/v1/auth/logout', data)

  console.log('response: ', response)
  return response
}

export const api = {
  logoutUser,
}
