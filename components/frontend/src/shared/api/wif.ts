import { LocalStorage } from 'quasar'
import { COOPNAME } from '../config'

export function getWIF(): string {
  const wif = LocalStorage.getItem(`${COOPNAME}:WIF`) as string
  if (!wif) throw new Error('Ошибка авторизации: приватный ключ не найден')

  return wif
}
