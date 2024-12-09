"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponseDto = exports.CompleteLoginDto = exports.InitiateLoginDto = exports.CompleteRegistrationDto = exports.InitiateRegistrationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class InitiateRegistrationDto {
}
exports.InitiateRegistrationDto = InitiateRegistrationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email пользователя',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], InitiateRegistrationDto.prototype, "email", void 0);
class CompleteRegistrationDto {
}
exports.CompleteRegistrationDto = CompleteRegistrationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email пользователя',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CompleteRegistrationDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Хэш-ключ для завершения регистрации',
        example: 'secureHash123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteRegistrationDto.prototype, "hashKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Уникальный идентификатор запроса',
        example: 'uuid-123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteRegistrationDto.prototype, "uuid", void 0);
class InitiateLoginDto {
}
exports.InitiateLoginDto = InitiateLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email пользователя',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], InitiateLoginDto.prototype, "email", void 0);
class CompleteLoginDto {
}
exports.CompleteLoginDto = CompleteLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email пользователя',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CompleteLoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Хэш-ключ для завершения входа',
        example: 'secureHash123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteLoginDto.prototype, "hashKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Уникальный идентификатор запроса',
        example: 'uuid-123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteLoginDto.prototype, "uuid", void 0);
class UserResponseDto {
}
exports.UserResponseDto = UserResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Токен доступа для авторизации',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Токен для обновления доступа',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "refreshToken", void 0);
//# sourceMappingURL=user.dto.js.map