/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CardMetaDTO } from './CardMetaDTO';
export type IssueCardInputDTO = {
    /**
     * Имя пользователя, которому будет выдана карта
     */
    username: string;
    /**
     * Зашифрованный приватный ключ
     */
    encrypted_key: string;
    /**
     * Зашифрованные данные, связанные с картой
     */
    encrypted_data: string;
    /**
     * Метаданные, связанные с картой
     */
    meta: CardMetaDTO;
};

