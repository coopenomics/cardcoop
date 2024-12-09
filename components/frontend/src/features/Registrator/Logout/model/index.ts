import { useSessionStore } from 'src/entities/Session'
import { useGlobalStore } from 'src/shared/store'
import { api } from '../api'
import { useCurrentUserStore } from 'src/entities/User'

export function useLogoutUser() {
  async function logout(): Promise<void> {
    const global = useGlobalStore()

    if (global.tokens?.refresh.token) await api.logoutUser(global.tokens?.refresh.token)

    await global.logout()

    useSessionStore().close()
    useCurrentUserStore().clearAccount()
  }

  return {
    logout,
  }
}
