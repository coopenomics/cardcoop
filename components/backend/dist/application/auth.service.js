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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_domain_service_1 = require("../domain/services/user.domain-service");
const jwt = require("jsonwebtoken");
let AuthService = class AuthService {
    constructor(userDomainService) {
        this.userDomainService = userDomainService;
    }
    async initiateRegistration(dto) {
        return this.userDomainService.initiateRegistration(dto.email);
    }
    async completeRegistration(dto) {
        const user = await this.userDomainService.completeRegistration(dto.email, dto.hashKey, dto.uuid);
        const accessToken = this.generateAccessToken(user.id);
        const refreshToken = this.generateRefreshToken(user.id);
        return { accessToken, refreshToken };
    }
    async initiateLogin(dto) {
        return this.userDomainService.initiateLogin(dto.email);
    }
    async completeLogin(dto) {
        const user = await this.userDomainService.completeLogin(dto.email, dto.hashKey, dto.uuid);
        const accessToken = this.generateAccessToken(user.id);
        const refreshToken = this.generateRefreshToken(user.id);
        return { accessToken, refreshToken };
    }
    generateAccessToken(userId) {
        return jwt.sign({ sub: userId }, 'access_secret', { expiresIn: '15m' });
    }
    generateRefreshToken(userId) {
        return jwt.sign({ sub: userId }, 'refresh_secret', { expiresIn: '7d' });
    }
    async refreshAccessToken(refreshToken) {
        try {
            const payload = jwt.verify(refreshToken, 'refresh_secret');
            const userId = payload.sub;
            const accessToken = this.generateAccessToken(userId);
            const newRefreshToken = this.generateRefreshToken(userId);
            return { accessToken, refreshToken: newRefreshToken };
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
    async logout(refreshToken) {
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_domain_service_1.UserDomainService])
], AuthService);
//# sourceMappingURL=auth.service.js.map