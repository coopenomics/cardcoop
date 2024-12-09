import { OpenAPI } from '@cardcoop/client'



export const setToken = (token:string): void => {
  OpenAPI.HEADERS = {
    'authorization': `Bearer ${token}`
  }
}
