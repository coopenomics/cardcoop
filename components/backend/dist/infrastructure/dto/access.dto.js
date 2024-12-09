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
exports.CoopJwtResponseDto = exports.CoopExchangeTicketDto = exports.ShareDataResponseDto = exports.ShareDataDto = exports.CoopInfoResponseDto = exports.PrepareShareDataDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class PrepareShareDataDto {
}
exports.PrepareShareDataDto = PrepareShareDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Название кооператива',
        example: 'CoopNameXYZ',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PrepareShareDataDto.prototype, "coopName", void 0);
class CoopInfoResponseDto {
}
exports.CoopInfoResponseDto = CoopInfoResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Название кооператива',
        example: 'CoopNameXYZ',
    }),
    __metadata("design:type", String)
], CoopInfoResponseDto.prototype, "coopName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Публичный ключ кооператива',
        example: 'publicKey123456789abcdef',
    }),
    __metadata("design:type", String)
], CoopInfoResponseDto.prototype, "coopPublicKey", void 0);
class ShareDataDto {
}
exports.ShareDataDto = ShareDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Название кооператива',
        example: 'CoopNameXYZ',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ShareDataDto.prototype, "coopName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Зашифрованные данные для передачи',
        example: 'encryptedData123456abcdef',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ShareDataDto.prototype, "encryptedData", void 0);
class ShareDataResponseDto {
}
exports.ShareDataResponseDto = ShareDataResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Билет для обмена данными',
        example: 'exchangeTicket12345',
    }),
    __metadata("design:type", String)
], ShareDataResponseDto.prototype, "ticket", void 0);
class CoopExchangeTicketDto {
}
exports.CoopExchangeTicketDto = CoopExchangeTicketDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Билет для обмена кооперативной информацией',
        example: 'exchangeTicket12345',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CoopExchangeTicketDto.prototype, "ticket", void 0);
class CoopJwtResponseDto {
}
exports.CoopJwtResponseDto = CoopJwtResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'JWT токен доступа для взаимодействия с кооперативом',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    __metadata("design:type", String)
], CoopJwtResponseDto.prototype, "accessToken", void 0);
//# sourceMappingURL=access.dto.js.map