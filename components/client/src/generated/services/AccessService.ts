/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessResponseDTO } from '../models/AccessResponseDTO';
import type { CoopInfoResponseDTO } from '../models/CoopInfoResponseDTO';
import type { EncryptedDataResponseDTO } from '../models/EncryptedDataResponseDTO';
import type { ExchangeTicketInputDTO } from '../models/ExchangeTicketInputDTO';
import type { ExchangeTicketResponseDTO } from '../models/ExchangeTicketResponseDTO';
import type { PrepareShareDataInputDTO } from '../models/PrepareShareDataInputDTO';
import type { RevokeAccessInputDTO } from '../models/RevokeAccessInputDTO';
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
     * @returns EncryptedDataResponseDTO Успешное получение зашифрованных данных
     * @throws ApiError
     */
    public static getEncryptedData(
        username: string,
        coopname: string,
    ): CancelablePromise<EncryptedDataResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/access/get-encrypted-data/{username}/{coopname}',
            path: {
                'username': username,
                'coopname': coopname,
            },
        });
    }
    /**
     * revokeAccess
     * Отзыв доступа у кооператива
     * @param requestBody
     * @returns any Доступ успешно отозван
     * @throws ApiError
     */
    public static revokeAccess(
        requestBody: RevokeAccessInputDTO,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/access/revoke',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * listAccesses
     * Получение списка доступов пользователя
     * @returns AccessResponseDTO Список предоставленных доступов пользователя
     * @throws ApiError
     */
    public static listAccesses(): CancelablePromise<Array<AccessResponseDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/access/list',
        });
    }
}
