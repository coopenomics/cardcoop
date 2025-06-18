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
const uuid_1 = require("uuid");
const card_entity_1 = require("../entities/card.entity");
const private_data_domain_service_1 = require("./private-data.domain-service");
let CardDomainService = class CardDomainService {
    constructor(cardRepository, privateDataService) {
        this.cardRepository = cardRepository;
        this.privateDataService = privateDataService;
    }
    async issueCard(data) {
        const privateData = await this.privateDataService.createPrivateData(data.user_id, data.encrypted_data, {
            version: data.meta?.version || 1,
            data_type: 'personal',
        });
        const existingCard = await this.cardRepository.findByUsername(data.username, data.coop_name);
        if (existingCard && existingCard.user_id !== data.user_id) {
            throw new common_1.ForbiddenException('Нельзя присвоить чужую карту!');
        }
        const card = new card_entity_1.Card({
            id: existingCard?.id || (0, uuid_1.v4)(),
            username: data.username,
            user_id: data.user_id,
            private_data_id: privateData.id,
            coop_name: data.coop_name,
            encrypted_key: data.encrypted_key,
            meta: {
                ...data.meta,
                issued_at: new Date(),
                card_type: data.meta?.card_type || 'standard',
                is_active: true,
            },
        });
        return this.cardRepository.save(card);
    }
    async getUserCards(user_id) {
        return this.cardRepository.findByUserId(user_id);
    }
    async getUserCardInCoop(user_id, coop_name) {
        return this.cardRepository.findByUserIdAndCoopName(user_id, coop_name);
    }
    async deactivateCard(card_id, user_id) {
        const card = await this.cardRepository.findById(card_id);
        if (!card) {
            throw new common_1.NotFoundException(`Карта с ID ${card_id} не найдена`);
        }
        if (card.user_id !== user_id) {
            throw new common_1.ForbiddenException('Нельзя деактивировать чужую карту');
        }
        const updatedCard = new card_entity_1.Card({
            ...card,
            meta: {
                ...card.meta,
                is_active: false,
            },
        });
        return this.cardRepository.save(updatedCard);
    }
};
exports.CardDomainService = CardDomainService;
exports.CardDomainService = CardDomainService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(card_repository_1.CARD_REPOSITORY)),
    __metadata("design:paramtypes", [Object, private_data_domain_service_1.PrivateDataDomainService])
], CardDomainService);
//# sourceMappingURL=card.domain-service.js.map