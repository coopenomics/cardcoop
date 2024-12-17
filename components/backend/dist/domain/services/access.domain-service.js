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
const access_request_repository_1 = require("../repositories/access-request.repository");
let AccessDomainService = class AccessDomainService {
    constructor(accessRequestRepository) {
        this.accessRequestRepository = accessRequestRepository;
    }
    async saveEncryptedCard(accessRequest) {
        const existingAccessRequest = await this.accessRequestRepository.findByUsernameAndCoopName(accessRequest.username, accessRequest.coopname);
        await this.accessRequestRepository.save(accessRequest);
        return accessRequest.ticket;
    }
    async getAccessRequestByTicket(ticket) {
        const request = await this.accessRequestRepository.findByTicket(ticket);
        return request;
    }
    async getAccessRequestByUsernameAndCoopname(username, coopname) {
        const request = await this.accessRequestRepository.findByUsernameAndCoopName(username, coopname);
        if (!request) {
            throw new common_1.BadRequestException('В доступе отказано по причине того, что он был отозван или не выдан');
        }
        return request;
    }
    async revokeAccess(username, coopname) {
        await this.accessRequestRepository.deleteByUsernameAndCoopName(username, coopname);
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