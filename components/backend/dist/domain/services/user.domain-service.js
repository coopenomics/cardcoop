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
exports.UserDomainService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../repositories/user.repository");
const uuid_1 = require("uuid");
const jwt = require("jsonwebtoken");
const jwt_token_repository_1 = require("../repositories/jwt-token.repository");
const uuid_token_repository_1 = require("../repositories/uuid-token.repository");
const user_entity_1 = require("../entities/user.entity");
const config_service_1 = require("../../infrastructure/config/config.service");
let UserDomainService = class UserDomainService {
    constructor(config, userRepository, jwtTokenRepository, uuidTokenRepository) {
        this.config = config;
        this.userRepository = userRepository;
        this.jwtTokenRepository = jwtTokenRepository;
        this.uuidTokenRepository = uuidTokenRepository;
    }
    async initiateRegistration(email) {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new common_1.BadRequestException('User already exists');
        }
        const salt = (0, uuid_1.v4)();
        const uuid = (0, uuid_1.v4)();
        await this.uuidTokenRepository.saveUuid(uuid, new Date(Date.now() + this.config.uuidRegExpirationMs));
        return { uuid, salt };
    }
    async completeRegistration(email, hash_key, uuid, salt) {
        const isValidUuid = await this.uuidTokenRepository.isUuidValid(uuid);
        if (!isValidUuid)
            throw new common_1.BadRequestException('Invalid or expired uuid');
        const user = new user_entity_1.User({
            id: (0, uuid_1.v4)(),
            email,
            salt,
            hash_key,
        });
        await this.userRepository.create(user);
        const access_token = this.generateAccessToken(user.id);
        const refresh_token = this.generateRefreshToken(user.id);
        await this.jwtTokenRepository.saveJwt(access_token, this.datePlusDays(this.config.accessTokenExpirationDays));
        await this.jwtTokenRepository.saveJwt(refresh_token, this.datePlusDays(this.config.refreshTokenExpirationDays));
        return { access_token, refresh_token };
    }
    async initiateLogin(email) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const uuid = (0, uuid_1.v4)();
        await this.uuidTokenRepository.saveUuid(uuid, new Date(Date.now() + this.config.uuidLoginExpirationMs));
        return { uuid, salt: user.salt };
    }
    async completeLogin(email, hash_key, uuid) {
        const isValidUuid = await this.uuidTokenRepository.isUuidValid(uuid);
        if (!isValidUuid)
            throw new Error('Invalid or expired uuid');
        const user = await this.userRepository.findByEmail(email);
        if (!user || user.hash_key !== hash_key) {
            throw new Error('Invalid credentials');
        }
        const access_token = this.generateAccessToken(user.id);
        const refresh_token = this.generateRefreshToken(user.id);
        await this.jwtTokenRepository.saveJwt(access_token, this.datePlusDays(this.config.accessTokenExpirationDays));
        await this.jwtTokenRepository.saveJwt(refresh_token, this.datePlusDays(this.config.refreshTokenExpirationDays));
        return { access_token, refresh_token };
    }
    async logout(data) {
        await this.jwtTokenRepository.revokeJwt(data.access_token);
        await this.jwtTokenRepository.revokeJwt(data.refresh_token);
    }
    async refreshAccessToken(refreshToken) {
        const isValid = await this.jwtTokenRepository.isJwtValid(refreshToken);
        if (!isValid)
            throw new common_1.BadRequestException('Invalid or revoked refresh token');
        try {
            const payload = jwt.verify(refreshToken, this.config.jwtSecret);
            const user_id = payload.sub;
            const access_token = this.generateAccessToken(user_id);
            const newRefreshToken = this.generateRefreshToken(user_id);
            await this.jwtTokenRepository.saveJwt(access_token, this.datePlusDays(this.config.accessTokenExpirationDays));
            await this.jwtTokenRepository.saveJwt(newRefreshToken, this.datePlusDays(this.config.refreshTokenExpirationDays));
            return { access_token, refresh_token: newRefreshToken };
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid refresh token');
        }
    }
    async revokeJwt(jwtToken) {
        await this.jwtTokenRepository.revokeJwt(jwtToken);
    }
    async revokeUuid(uuid) {
        await this.uuidTokenRepository.revokeUuid(uuid);
    }
    generateAccessToken(user_id) {
        return jwt.sign({ sub: user_id }, this.config.jwtSecret, {
            expiresIn: `${this.config.accessTokenExpirationDays}d`,
        });
    }
    generateRefreshToken(user_id) {
        return jwt.sign({ sub: user_id }, this.config.jwtSecret, {
            expiresIn: `${this.config.refreshTokenExpirationDays}d`,
        });
    }
    datePlusDays(days) {
        return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }
};
exports.UserDomainService = UserDomainService;
exports.UserDomainService = UserDomainService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(user_repository_1.USER_REPOSITORY)),
    __param(2, (0, common_1.Inject)(jwt_token_repository_1.JWT_TOKEN_REPOSITORY)),
    __param(3, (0, common_1.Inject)(uuid_token_repository_1.UUID_TOKEN_REPOSITORY)),
    __metadata("design:paramtypes", [config_service_1.ConfigService, Object, Object, Object])
], UserDomainService);
//# sourceMappingURL=user.domain-service.js.map