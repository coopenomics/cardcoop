/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CoopExchangeTicketDto } from '../models/CoopExchangeTicketDto';
import type { CoopInfoResponseDto } from '../models/CoopInfoResponseDto';
import type { CoopJwtResponseDto } from '../models/CoopJwtResponseDto';
import type { PrepareShareDataDto } from '../models/PrepareShareDataDto';
import type { ShareDataDto } from '../models/ShareDataDto';
import type { ShareDataResponseDto } from '../models/ShareDataResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccessService {
    /**
     * prepareShareData
     * Подготовка данных для общего доступа
     * @param requestBody
     * @returns CoopInfoResponseDto Успешная подготовка данных
     * @throws ApiError
     */
    public static prepareShareData(
        requestBody: PrepareShareDataDto,
    ): CancelablePromise<CoopInfoResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/access/prepare-share-data',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * shareData
     * Передача данных
     * @param requestBody
     * @returns ShareDataResponseDto Успешная передача данных
     * @throws ApiError
     */
    public static shareData(
        requestBody: ShareDataDto,
    ): CancelablePromise<ShareDataResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/access/share-data',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * exchangeTicketForJwt
     * Обмен тикета на JWT
     * @param requestBody
     * @returns CoopJwtResponseDto Успешный обмен тикета на JWT
     * @throws ApiError
     */
    public static exchangeTicketForJwt(
        requestBody: CoopExchangeTicketDto,
    ): CancelablePromise<CoopJwtResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/access/exchange-ticket',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * getEncryptedData
     * Получение зашифрованных данных
     * @param username
     * @param coopName
     * @returns any Успешное получение зашифрованных данных
     * @throws ApiError
     */
    public static getEncryptedData(
        username: string,
        coopName: string,
    ): CancelablePromise<{
        encryptedData?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/access/get-encrypted-data/{username}/{coopName}',
            path: {
                'username': username,
                'coopName': coopName,
            },
        });
    }
}
