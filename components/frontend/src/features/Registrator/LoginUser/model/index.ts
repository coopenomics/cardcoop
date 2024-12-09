import { useSessionStore } from 'src/entities/Session'
import { useGlobalStore } from 'src/shared/store'
import { api } from '../api'
import {setToken} from 'src/shared/api/client'

export function useLoginUser() {
  const globalStore = useGlobalStore()

  async function login(email: string, wif: string): Promise<void> {
    const auth = await api.loginUser(email, wif)

    await globalStore.setWif(auth.user.username, wif)
    await globalStore.setTokens(auth.tokens)

    const session = useSessionStore()
    await session.init()

    setToken(auth.tokens.access.token)
  }

  return {
    login,
  }
}
