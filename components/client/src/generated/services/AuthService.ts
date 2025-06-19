/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompleteLoginInputDTO } from '../models/CompleteLoginInputDTO';
import type { CompleteLoginResponseDTO } from '../models/CompleteLoginResponseDTO';
import type { CompleteRegistrationInputDTO } from '../models/CompleteRegistrationInputDTO';
import type { InitiateLoginInputDTO } from '../models/InitiateLoginInputDTO';
import type { InitiateRegistrationInputDTO } from '../models/InitiateRegistrationInputDTO';
import type { LogoutInputDTO } from '../models/LogoutInputDTO';
import type { RefreshTokenInputDTO } from '../models/RefreshTokenInputDTO';
import type { VerifyEmailInputDTO } from '../models/VerifyEmailInputDTO';
import type { VerifyEmailResponseDTO } from '../models/VerifyEmailResponseDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * initiateRegistration
     * Инициализация регистрации
     * @param requestBody
     * @returns InitiateRegistrationInputDTO Успешная инициализация регистрации
     * @throws ApiError
     */
    public static initiateRegistration(
        requestBody: InitiateRegistrationInputDTO,
    ): CancelablePromise<InitiateRegistrationInputDTO> {
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
     * @returns CompleteLoginResponseDTO Успешное завершение регистрации
     * @throws ApiError
     */
    public static completeRegistration(
        requestBody: CompleteRegistrationInputDTO,
    ): CancelablePromise<CompleteLoginResponseDTO> {
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
     * @returns InitiateLoginInputDTO Успешная инициализация входа
     * @throws ApiError
     */
    public static initiateLogin(
        requestBody: InitiateLoginInputDTO,
    ): CancelablePromise<InitiateLoginInputDTO> {
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
     * @returns CompleteLoginResponseDTO Успешное завершение входа
     * @throws ApiError
     */
    public static completeLogin(
        requestBody: CompleteLoginInputDTO,
    ): CancelablePromise<CompleteLoginResponseDTO> {
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
     * @param requestBody
     * @returns CompleteLoginResponseDTO Успешное обновление токена
     * @throws ApiError
     */
    public static refreshAccessToken(
        requestBody: RefreshTokenInputDTO,
    ): CancelablePromise<CompleteLoginResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh-token',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * logout
     * Выход
     * @param requestBody
     * @returns any Успешный выход
     * @throws ApiError
     */
    public static logout(
        requestBody: LogoutInputDTO,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * verifyEmail
     * Подтверждение email кодом
     * @param requestBody
     * @returns VerifyEmailResponseDTO Email успешно подтвержден
     * @throws ApiError
     */
    public static verifyEmail(
        requestBody: VerifyEmailInputDTO,
    ): CancelablePromise<VerifyEmailResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/verify-email',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
