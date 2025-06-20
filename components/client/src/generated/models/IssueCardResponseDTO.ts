/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type IssueCardResponseDTO = {
    /**
     * Уникальный идентификатор карты
     */
    id: string;
    /**
     * Имя пользователя, связанного с картой
     */
    username: string;
    /**
     * Название кооператива
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
};

