/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CardResponseDto } from '../models/CardResponseDto';
import type { IssueCardDto } from '../models/IssueCardDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CardService {
    /**
     * issueCard
     * Выпуск карты
     * @param requestBody
     * @returns CardResponseDto Успешный выпуск карты
     * @throws ApiError
     */
    public static issueCard(
        requestBody: IssueCardDto,
    ): CancelablePromise<CardResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/card/issue',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
