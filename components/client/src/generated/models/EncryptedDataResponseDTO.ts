/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Function } from './Function';
export type EncryptedDataResponseDTO = {
    /**
     * Зашифрованные данные
     */
    encrypted_data: string;
    /**
     * Имя кооператива
     */
    coopname: string;
    /**
     * Имя пользователя
     */
    username: string;
    /**
     * Публичный ключ
     */
    public_key: string;
    /**
     * Метаданные доступа
     */
    meta: Function;
};

