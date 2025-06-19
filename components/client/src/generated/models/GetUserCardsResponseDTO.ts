/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GetUserCardsResponseDTO = {
    /**
     * Уникальный идентификатор карты
     */
    id: string;
    /**
     * Имя пользователя в кооперативе
     */
    username: string;
    /**
     * Имя аккаунта кооператива
     */
    coopname: string;
    /**
     * Дата выпуска карты
     */
    issued_at: string;
    /**
     * Тип карты
     */
    card_type: string;
    /**
     * Активна ли карта
     */
    is_active: boolean;
    /**
     * Зашифрованный ключ
     */
    encrypted_key: string;
};

