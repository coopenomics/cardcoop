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
exports.AccessService = void 0;
const common_1 = require("@nestjs/common");
const access_domain_service_1 = require("../domain/services/access.domain-service");
const access_request_entity_1 = require("../domain/access-request.entity");
const coop_repository_1 = require("../domain/coop.repository");
const jwt = require("jsonwebtoken");
let AccessService = class AccessService {
    constructor(accessDomainService, coopRepository) {
        this.accessDomainService = accessDomainService;
        this.coopRepository = coopRepository;
    }
    async prepareShareData(dto) {
        const coop = await this.coopRepository.findByName(dto.coopName);
        if (!coop) {
            throw new common_1.BadRequestException('Cooperative not found');
        }
        return {
            coopName: coop.name,
            coopPublicKey: coop.publicKey,
        };
    }
    async shareData(dto, username) {
        const accessRequest = new access_request_entity_1.AccessRequest();
        accessRequest.username = username;
        accessRequest.coopName = dto.coopName;
        accessRequest.encryptedData = dto.encryptedData;
        const ticket = await this.accessDomainService.saveEncryptedData(accessRequest);
        return { ticket };
    }
    async exchangeTicketForJwt(dto) {
        const accessRequest = await this.accessDomainService.getAccessRequestByAccessId(dto.ticket);
        if (!accessRequest) {
            throw new common_1.BadRequestException('Invalid ticket');
        }
        const coopAccessToken = jwt.sign({ username: accessRequest.username, coopName: accessRequest.coopName }, 'coop_access_secret', { expiresIn: '15m' });
        return { accessToken: coopAccessToken };
    }
    async getEncryptedData(username, coopName) {
        const accessRequest = await this.accessDomainService.getEncryptedData(username, coopName);
        if (!accessRequest) {
            throw new common_1.BadRequestException('Access not granted');
        }
        return accessRequest.encryptedData;
    }
};
exports.AccessService = AccessService;
exports.AccessService = AccessService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(coop_repository_1.COOP_REPOSITORY)),
    __metadata("design:paramtypes", [access_domain_service_1.AccessDomainService, Object])
], AccessService);
//# sourceMappingURL=access.service.js.map