import { STORAGE_URL } from '../config';

export function constructImageSrc(name: string): string {
  if (name.startsWith('https://')) {
    return name;
  } else {
    return STORAGE_URL + name;
  }
}
