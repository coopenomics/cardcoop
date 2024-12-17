import { createHash } from 'crypto'

export const sha256 = (data: string): string => {
  const hash = createHash('sha256')
    .update(data)
    .digest('hex');
  
  return hash
}