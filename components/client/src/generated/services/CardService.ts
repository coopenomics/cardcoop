/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetUserCardsResponseDTO } from '../models/GetUserCardsResponseDTO';
import type { IssueCardInputDTO } from '../models/IssueCardInputDTO';
import type { IssueCardResponseDTO } from '../models/IssueCardResponseDTO';
import type { PrivateDataResponseDTO } from '../models/PrivateDataResponseDTO';
import type { SchemaResponseDTO } from '../models/SchemaResponseDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CardService {
    /**
     * issueCard
     * Выпуск карты
     * @param requestBody
     * @returns IssueCardResponseDTO Успешный выпуск карты
     * @throws ApiError
     */
    public static issueCard(
        requestBody: IssueCardInputDTO,
    ): CancelablePromise<IssueCardResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/card/issue',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * getSchema
     * Извлечение актуальной схемы карты
     * @returns SchemaResponseDTO Получить json-схему карты
     * @throws ApiError
     */
    public static getSchema(): CancelablePromise<SchemaResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/card/schema',
        });
    }
    /**
     * getUserCards
     * Получение всех карт пользователя
     * @returns GetUserCardsResponseDTO Список карт пользователя
     * @throws ApiError
     */
    public static getUserCards(): CancelablePromise<Array<GetUserCardsResponseDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/card/user',
        });
    }
    /**
     * getCardByUserAndCoop
     * Получение карты по имени пользователя и имени кооператива
     * @param username Имя пользователя
     * @param coopname Имя кооператива
     * @returns GetUserCardsResponseDTO Данные карты с зашифрованным ключом
     * @throws ApiError
     */
    public static getCardByUserAndCoop(
        username: string,
        coopname: string,
    ): CancelablePromise<GetUserCardsResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/card/by-coop',
            query: {
                'username': username,
                'coopname': coopname,
            },
        });
    }
    /**
     * getCardById
     * Получение карты по ID
     * @param cardId ID карты
     * @returns GetUserCardsResponseDTO Данные карты
     * @throws ApiError
     */
    public static getCardById(
        cardId: string,
    ): CancelablePromise<GetUserCardsResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/card/{card_id}',
            path: {
                'card_id': cardId,
            },
        });
    }
    /**
     * deactivateCard
     * Деактивация карты
     * @param cardId ID карты для деактивации
     * @returns IssueCardResponseDTO Карта успешно деактивирована
     * @throws ApiError
     */
    public static deactivateCard(
        cardId: string,
    ): CancelablePromise<IssueCardResponseDTO> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/card/{card_id}',
            path: {
                'card_id': cardId,
            },
        });
    }
    /**
     * getPrivateData
     * Получение приватных данных по ID карты
     * @param cardId ID карты
     * @returns PrivateDataResponseDTO Приватные данные пользователя
     * @throws ApiError
     */
    public static getPrivateData(
        cardId: string,
    ): CancelablePromise<PrivateDataResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/card/{card_id}/private-data',
            path: {
                'card_id': cardId,
            },
        });
    }
}
