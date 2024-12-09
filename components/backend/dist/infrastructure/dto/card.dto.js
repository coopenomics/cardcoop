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
exports.CardResponseDto = exports.IssueCardDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class IssueCardDto {
}
exports.IssueCardDto = IssueCardDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Имя пользователя, которому будет выдана карта',
        example: 'john_doe',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IssueCardDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Зашифрованные данные, связанные с картой',
        example: 'encryptedData123456abcdef',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IssueCardDto.prototype, "encryptedData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Название кооператива',
        example: 'CoopNameXYZ',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IssueCardDto.prototype, "coopName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Цифровая подпись для проверки данных',
        example: 'signatureBase64Encoded12345',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IssueCardDto.prototype, "signature", void 0);
class CardResponseDto {
}
exports.CardResponseDto = CardResponseDto;
//# sourceMappingURL=card.dto.js.map