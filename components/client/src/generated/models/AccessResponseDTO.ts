/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AccessResponseDTO = {
    /**
     * Уникальный идентификатор доступа
     */
    id: string;
    /**
     * Имя пользователя, чьи данные доступны
     */
    username: string;
    /**
     * Название кооператива, которому предоставлен доступ
     */
    coopname: string;
    /**
     * Дата предоставления доступа
     */
    granted_at: string;
    /**
     * Активен ли доступ
     */
    is_active: boolean;
};

