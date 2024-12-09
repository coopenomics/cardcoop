import { IBaseReadBlockchainErrors } from '../lib/types/errors';
import { FailAlert } from '../api/alerts';

export function createBaseReadBlockchainErrors(
  name: string
): IBaseReadBlockchainErrors {
  return {
    loadError: createBlockchainGetError(name),
  };
}

export function createBlockchainGetError(name: string) {
  return `Не удалось загрузить ${name} из блокчейна`;
}

export function handleException(e: unknown): void {
  if (e instanceof Error) {
    FailAlert(e.message);
  } else {
    FailAlert('Произошла неизвестная ошибка');
  }
}
