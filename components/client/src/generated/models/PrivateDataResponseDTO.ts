/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PrivateDataResponseDTO = {
    /**
     * Зашифрованные данные пользователя
     */
    encrypted_data: string;
    /**
     * Хеш данных для верификации
     */
    data_hash: string;
    /**
     * Версия формата данных
     */
    version: number;
    /**
     * Тип приватных данных
     */
    data_type: string;
};

