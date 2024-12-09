import { describe, expect, it } from 'vitest'
import { createClient, type MakeAllFieldsRequired, type ValueTypes } from '../src'
import { getExtensions } from '../src/selectors/getExtensions'
import { Gql, $ } from '../src/zeus'

describe('should', () => {
  it('exported', async () => {
    const client = createClient({
      baseUrl: 'http://127.0.0.1:2998/v1/graphql',
      headers: {
        'server-secret': 'SECRET'
        // `Authorization': 'Bearer ${token}`
      }
    })
    
    // Выполняем запрос напрямую через client, не используя selector
    const {getExtensions: data} = await client.Query(
      getExtensions,
      {
        variables: {
          data: {enabled: true}
        }
      }
    );

    console.log(data)
  })
})
