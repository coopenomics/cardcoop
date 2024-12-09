import { api } from '../api'

export function useLostKey() {
  async function lostKeyRequest(email: string): Promise<void> {
    await api.lostKeyRequest(email)
  }

  return {
    lostKeyRequest,
  }
}
