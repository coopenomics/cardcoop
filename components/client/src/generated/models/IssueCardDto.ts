/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type IssueCardDto = {
    /**
     * Имя пользователя, которому будет выдана карта
     */
    username: string;
    /**
     * Зашифрованные данные, связанные с картой
     */
    encryptedData: string;
    /**
     * Название кооператива
     */
    coopName: string;
    /**
     * Цифровая подпись для проверки данных
     */
    signature: string;
};

