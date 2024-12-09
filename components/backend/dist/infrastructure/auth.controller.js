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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../application/auth.service");
const user_dto_1 = require("./dto/user.dto");
const swagger_1 = require("@nestjs/swagger");
const swagger_decorator_1 = require("./decorators/swagger.decorator");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async initiateRegistration(dto) {
        return this.authService.initiateRegistration(dto);
    }
    async completeRegistration(dto) {
        return this.authService.completeRegistration(dto);
    }
    async initiateLogin(dto) {
        return this.authService.initiateLogin(dto);
    }
    async completeLogin(dto) {
        return this.authService.completeLogin(dto);
    }
    async refreshAccessToken(authHeader) {
        const refreshToken = authHeader.split(' ')[1];
        return this.authService.refreshAccessToken(refreshToken);
    }
    async logout(authHeader) {
        const refreshToken = authHeader.split(' ')[1];
        await this.authService.logout(refreshToken);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('initiate-registration'),
    (0, swagger_decorator_1.Swagger)('Инициализация регистрации'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Успешная инициализация регистрации',
        type: user_dto_1.InitiateRegistrationDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.InitiateRegistrationDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "initiateRegistration", null);
__decorate([
    (0, common_1.Post)('complete-registration'),
    (0, swagger_decorator_1.Swagger)('Завершение регистрации'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Успешное завершение регистрации',
        type: user_dto_1.UserResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.CompleteRegistrationDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "completeRegistration", null);
__decorate([
    (0, common_1.Post)('initiate-login'),
    (0, swagger_decorator_1.Swagger)('Инициализация входа'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Успешная инициализация входа',
        type: user_dto_1.InitiateLoginDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.InitiateLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "initiateLogin", null);
__decorate([
    (0, common_1.Post)('complete-login'),
    (0, swagger_decorator_1.Swagger)('Завершение входа'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Успешное завершение входа',
        type: user_dto_1.UserResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.CompleteLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "completeLogin", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    (0, swagger_decorator_1.Swagger)('Обновление токена'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Успешное обновление токена',
        type: user_dto_1.UserResponseDto,
    }),
    __param(0, (0, common_1.Headers)('Authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshAccessToken", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, swagger_decorator_1.Swagger)('Выход'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Успешный выход',
    }),
    __param(0, (0, common_1.Headers)('Authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map