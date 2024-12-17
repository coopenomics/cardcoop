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
const user_entity_1 = require("../entities/user.entity");
const uuid_1 = require("uuid");
const jwt = require("jsonwebtoken");
let UserDomainService = class UserDomainService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async initiateRegistration(email) {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        const salt = (0, uuid_1.v4)();
        const uuid = (0, uuid_1.v4)();
        return { uuid, salt };
    }
    async completeRegistration(email, hash_key, uuid, salt) {
        const user = new user_entity_1.User({
            id: (0, uuid_1.v4)(),
            email,
            salt,
            hash_key,
        });
        await this.userRepository.create(user);
        const access_token = this.generateAccessToken(user.id);
        const refresh_token = this.generateRefreshToken(user.id);
        return { access_token, refresh_token };
    }
    async initiateLogin(email) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        return { uuid: (0, uuid_1.v4)(), salt: user.salt };
    }
    async completeLogin(email, hash_key, uuid) {
        const user = await this.userRepository.findByEmail(email);
        if (!user || user.hash_key !== hash_key) {
            throw new Error('Invalid credentials');
        }
        const access_token = this.generateAccessToken(user.id);
        const refresh_token = this.generateRefreshToken(user.id);
        return { access_token, refresh_token };
    }
    generateAccessToken(userId) {
        return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
    }
    generateRefreshToken(userId) {
        return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '180d' });
    }
    async refreshAccessToken(refreshToken) {
        try {
            const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
            const userId = payload.sub;
            const access_token = this.generateAccessToken(userId);
            const newRefreshToken = this.generateRefreshToken(userId);
            return { access_token, refresh_token: newRefreshToken };
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
};
exports.UserDomainService = UserDomainService;
exports.UserDomainService = UserDomainService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], UserDomainService);
//# sourceMappingURL=user.domain-service.js.map