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
exports.AccessDomainService = void 0;
const common_1 = require("@nestjs/common");
const access_request_repository_1 = require("../access-request.repository");
const uuid_1 = require("uuid");
let AccessDomainService = class AccessDomainService {
    constructor(accessRequestRepository) {
        this.accessRequestRepository = accessRequestRepository;
    }
    async saveEncryptedData(accessRequest) {
        const existingAccessRequest = await this.accessRequestRepository.findByUsernameAndCoopName(accessRequest.username, accessRequest.coopName);
        if (existingAccessRequest) {
            existingAccessRequest.encryptedData = accessRequest.encryptedData;
            await this.accessRequestRepository.update(existingAccessRequest);
            return existingAccessRequest.accessId;
        }
        else {
            const accessId = (0, uuid_1.v4)();
            accessRequest.accessId = accessId;
            await this.accessRequestRepository.create(accessRequest);
            return accessId;
        }
    }
    async getAccessRequestByAccessId(accessId) {
        return this.accessRequestRepository.findByAccessId(accessId);
    }
    async getEncryptedData(username, coopName) {
        const request = await this.accessRequestRepository.findByUsernameAndCoopName(username, coopName);
        if (!request) {
            throw new Error('Access not granted');
        }
        return request;
    }
    async revokeAccess(username, coopName) {
        await this.accessRequestRepository.deleteByUsernameAndCoopName(username, coopName);
    }
    async listAccesses(username) {
        return this.accessRequestRepository.findByUsername(username);
    }
};
exports.AccessDomainService = AccessDomainService;
exports.AccessDomainService = AccessDomainService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(access_request_repository_1.ACCESS_REQUEST_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], AccessDomainService);
//# sourceMappingURL=access.domain-service.js.map