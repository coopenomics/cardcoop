/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IssueCardInputDTO } from '../models/IssueCardInputDTO';
import type { IssueCardResponseDTO } from '../models/IssueCardResponseDTO';
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
}
