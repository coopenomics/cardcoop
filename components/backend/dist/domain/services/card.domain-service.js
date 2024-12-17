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
exports.CardDomainService = void 0;
const common_1 = require("@nestjs/common");
const card_repository_1 = require("../repositories/card.repository");
const card_entity_1 = require("../entities/card.entity");
const createHash_1 = require("../../utils/createHash");
const uuid_1 = require("uuid");
let CardDomainService = class CardDomainService {
    constructor(cardRepository) {
        this.cardRepository = cardRepository;
    }
    async issueCard(data) {
        const data_hash = (0, createHash_1.sha256)(data.encrypted_data);
        const card = new card_entity_1.Card({
            id: (0, uuid_1.v4)(),
            username: data.username,
            encrypted_data: data.encrypted_data,
            encrypted_key: data.encrypted_key,
            userId: data.userId,
            data_hash,
            meta: { ...data.meta, issued_at: new Date() }
        });
        const exist = await this.cardRepository.findByUsername(card.username);
        if (exist && exist.userId != data.userId)
            throw new common_1.ForbiddenException('Нельзя присвоить чужую карту!');
        if (exist)
            card.id = exist.id;
        return this.cardRepository.save(card);
    }
};
exports.CardDomainService = CardDomainService;
exports.CardDomainService = CardDomainService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(card_repository_1.CARD_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CardDomainService);
//# sourceMappingURL=card.domain-service.js.map