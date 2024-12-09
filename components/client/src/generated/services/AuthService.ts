/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompleteLoginDto } from '../models/CompleteLoginDto';
import type { CompleteRegistrationDto } from '../models/CompleteRegistrationDto';
import type { InitiateLoginDto } from '../models/InitiateLoginDto';
import type { InitiateRegistrationDto } from '../models/InitiateRegistrationDto';
import type { UserResponseDto } from '../models/UserResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * initiateRegistration
     * Инициализация регистрации
     * @param requestBody
     * @returns InitiateRegistrationDto Успешная инициализация регистрации
     * @throws ApiError
     */
    public static initiateRegistration(
        requestBody: InitiateRegistrationDto,
    ): CancelablePromise<InitiateRegistrationDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/initiate-registration',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * completeRegistration
     * Завершение регистрации
     * @param requestBody
     * @returns UserResponseDto Успешное завершение регистрации
     * @throws ApiError
     */
    public static completeRegistration(
        requestBody: CompleteRegistrationDto,
    ): CancelablePromise<UserResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/complete-registration',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * initiateLogin
     * Инициализация входа
     * @param requestBody
     * @returns InitiateLoginDto Успешная инициализация входа
     * @throws ApiError
     */
    public static initiateLogin(
        requestBody: InitiateLoginDto,
    ): CancelablePromise<InitiateLoginDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/initiate-login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * completeLogin
     * Завершение входа
     * @param requestBody
     * @returns UserResponseDto Успешное завершение входа
     * @throws ApiError
     */
    public static completeLogin(
        requestBody: CompleteLoginDto,
    ): CancelablePromise<UserResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/complete-login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * refreshAccessToken
     * Обновление токена
     * @param authorization
     * @returns UserResponseDto Успешное обновление токена
     * @throws ApiError
     */
    public static refreshAccessToken(
        authorization: string,
    ): CancelablePromise<UserResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh-token',
            headers: {
                'Authorization': authorization,
            },
        });
    }
    /**
     * logout
     * Выход
     * @param authorization
     * @returns any Успешный выход
     * @throws ApiError
     */
    public static logout(
        authorization: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
            headers: {
                'Authorization': authorization,
            },
        });
    }
}
