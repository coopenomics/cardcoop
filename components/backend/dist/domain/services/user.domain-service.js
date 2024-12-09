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
const user_repository_1 = require("../user.repository");
const user_entity_1 = require("../user.entity");
const uuid_1 = require("uuid");
let UserDomainService = class UserDomainService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async initiateRegistration(email) {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        const serverSalt = (0, uuid_1.v4)();
        const uuid = (0, uuid_1.v4)();
        return { uuid, serverSalt };
    }
    async completeRegistration(email, hashKey, uuid) {
        const user = new user_entity_1.User();
        user.email = email;
        user.serverSalt = uuid;
        user.hashKey = hashKey;
        return this.userRepository.create(user);
    }
    async initiateLogin(email) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        return { uuid: user.serverSalt, serverSalt: user.serverSalt };
    }
    async completeLogin(email, hashKey, uuid) {
        const user = await this.userRepository.findByEmail(email);
        if (!user || user.serverSalt !== uuid || user.hashKey !== hashKey) {
            throw new Error('Invalid credentials');
        }
        return user;
    }
};
exports.UserDomainService = UserDomainService;
exports.UserDomainService = UserDomainService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], UserDomainService);
//# sourceMappingURL=user.domain-service.js.map