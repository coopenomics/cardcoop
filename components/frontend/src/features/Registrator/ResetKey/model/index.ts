import { api } from '../api'

export function useResetKey() {
  async function resetKey(token: string, public_key: string): Promise<void> {
    await api.resetKey(token, public_key)
  }

  return {
    resetKey
  }
}
