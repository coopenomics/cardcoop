/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessMetaInputDTO } from './AccessMetaInputDTO';
export type ShareDataDTO = {
    /**
     * Имя аккаунта пользователя
     */
    username: string;
    /**
     * Имя аккаунта кооператива
     */
    coopname: string;
    /**
     * Зашифрованные данные для передачи
     */
    encrypted_data: string;
    /**
     * Публичный ключ кооператива необходимый для дешифровки
     */
    public_key: string;
    /**
     * Не обязательные данные для идентификации устройства пользователя
     */
    meta?: AccessMetaInputDTO;
};

