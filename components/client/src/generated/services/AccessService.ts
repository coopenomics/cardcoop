/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExchangeTicketInputDTO } from '../models/ExchangeTicketInputDTO';
import type { CoopInfoResponseDTO } from '../models/CoopInfoResponseDTO';
import type { ExchangeTicketResponseDTO } from '../models/ExchangeTicketResponseDTO';
import type { PrepareShareDataInputDTO } from '../models/PrepareShareDataInputDTO';
import type { ShareDataDTO } from '../models/ShareDataDTO';
import type { ShareDataResponseDTO } from '../models/ShareDataResponseDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccessService {
    /**
     * prepareShareData
     * Подготовка данных для общего доступа
     * @param requestBody
     * @returns CoopInfoResponseDTO Успешная подготовка данных
     * @throws ApiError
     */
    public static prepareShareData(
        requestBody: PrepareShareDataInputDTO,
    ): CancelablePromise<CoopInfoResponseDTO> {
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
     * @returns ShareDataResponseDTO Успешная передача данных
     * @throws ApiError
     */
    public static shareData(
        requestBody: ShareDataDTO,
    ): CancelablePromise<ShareDataResponseDTO> {
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
     * @returns ExchangeTicketResponseDTO Успешный обмен тикета на JWT
     * @throws ApiError
     */
    public static exchangeTicketForJwt(
        requestBody: ExchangeTicketInputDTO,
    ): CancelablePromise<ExchangeTicketResponseDTO> {
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
     * @param coopname
     * @returns any Успешное получение зашифрованных данных
     * @throws ApiError
     */
    public static getEncryptedData(
        username: string,
        coopname: string,
    ): CancelablePromise<{
        data?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/access/get-encrypted-data/{username}/{coopname}',
            path: {
                'username': username,
                'coopname': coopname,
            },
        });
    }
}
