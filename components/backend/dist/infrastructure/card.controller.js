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
exports.CardController = void 0;
const common_1 = require("@nestjs/common");
const card_service_1 = require("../application/card.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const card_dto_1 = require("./dto/card.dto");
const swagger_1 = require("@nestjs/swagger");
const swagger_decorator_1 = require("./decorators/swagger.decorator");
let CardController = class CardController {
    constructor(cardService) {
        this.cardService = cardService;
    }
    async issueCard(dto, req) {
        const userId = req.user.userId;
        return this.cardService.issueCard(dto, userId);
    }
};
exports.CardController = CardController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('issue'),
    (0, swagger_decorator_1.Swagger)('Выпуск карты'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Успешный выпуск карты',
        type: card_dto_1.CardResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [card_dto_1.IssueCardDto, Object]),
    __metadata("design:returntype", Promise)
], CardController.prototype, "issueCard", null);
exports.CardController = CardController = __decorate([
    (0, swagger_1.ApiTags)('Card'),
    (0, common_1.Controller)('card'),
    __metadata("design:paramtypes", [card_service_1.CardService])
], CardController);
//# sourceMappingURL=card.controller.js.map