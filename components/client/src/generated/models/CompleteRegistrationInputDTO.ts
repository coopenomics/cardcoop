/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CompleteRegistrationInputDTO = {
    /**
     * Email пользователя
     */
    email: string;
    /**
     * Хэш-ключ для завершения регистрации
     */
    hash_key: string;
    /**
     * Уникальный идентификатор запроса
     */
    uuid: string;
    /**
     * Серверная соль для защиты данных
     */
    salt: string;
};

