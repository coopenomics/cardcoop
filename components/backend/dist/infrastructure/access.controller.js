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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessController = void 0;
const common_1 = require("@nestjs/common");
const access_service_1 = require("../application/access.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const access_dto_1 = require("./dto/access.dto");
const coop_jwt_auth_guard_1 = require("./guards/coop-jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const swagger_decorator_1 = require("./decorators/swagger.decorator");
let AccessController = class AccessController {
    constructor(accessService) {
        this.accessService = accessService;
    }
    async prepareShareData(dto) {
        return this.accessService.prepareShareData(dto);
    }
    async shareData(dto, req) {
        const username = req.user.userId;
        return this.accessService.shareData(dto, username);
    }
    async exchangeTicketForJwt(dto) {
        return this.accessService.exchangeTicketForJwt(dto);
    }
    async getEncryptedData(username, coopName) {
        const encryptedData = await this.accessService.getEncryptedData(username, coopName);
        return { encryptedData };
    }
};
exports.AccessController = AccessController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('prepare-share-data'),
    (0, swagger_decorator_1.Swagger)('Подготовка данных для общего доступа'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Успешная подготовка данных',
        type: access_dto_1.CoopInfoResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [access_dto_1.PrepareShareDataDto]),
    __metadata("design:returntype", Promise)
], AccessController.prototype, "prepareShareData", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('share-data'),
    (0, swagger_decorator_1.Swagger)('Передача данных'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Успешная передача данных',
        type: access_dto_1.ShareDataResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [access_dto_1.ShareDataDto, Object]),
    __metadata("design:returntype", Promise)
], AccessController.prototype, "shareData", null);
__decorate([
    (0, common_1.Post)('exchange-ticket'),
    (0, swagger_decorator_1.Swagger)('Обмен тикета на JWT'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Успешный обмен тикета на JWT',
        type: access_dto_1.CoopJwtResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [access_dto_1.CoopExchangeTicketDto]),
    __metadata("design:returntype", Promise)
], AccessController.prototype, "exchangeTicketForJwt", null);
__decorate([
    (0, common_1.UseGuards)(coop_jwt_auth_guard_1.CoopJwtAuthGuard),
    (0, common_1.Get)('get-encrypted-data/:username/:coopName'),
    (0, swagger_decorator_1.Swagger)('Получение зашифрованных данных'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Успешное получение зашифрованных данных',
        schema: {
            type: 'object',
            properties: {
                encryptedData: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Param)('coopName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AccessController.prototype, "getEncryptedData", null);
exports.AccessController = AccessController = __decorate([
    (0, swagger_1.ApiTags)('Access'),
    (0, common_1.Controller)('access'),
    __metadata("design:paramtypes", [access_service_1.AccessService])
], AccessController);
//# sourceMappingURL=access.controller.js.map