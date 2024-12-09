export declare class InitiateRegistrationDto {
    email: string;
}
export declare class CompleteRegistrationDto {
    email: string;
    hashKey: string;
    uuid: string;
}
export declare class InitiateLoginDto {
    email: string;
}
export declare class CompleteLoginDto {
    email: string;
    hashKey: string;
    uuid: string;
}
export declare class UserResponseDto {
    accessToken: string;
    refreshToken: string;
}
