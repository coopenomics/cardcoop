/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type IssueCardInputDTO = {
    /**
     * Имя пользователя, которому будет выдана карта
     */
    username: string;
    /**
     * Зашифрованные данные, связанные с картой
     */
    data: string;
    /**
     * Название кооператива
     */
    coopname: string;
    /**
     * Цифровая подпись для проверки данных
     */
    signature: string;
};

