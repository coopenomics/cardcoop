"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const auth_controller_1 = require("./infrastructure/auth.controller");
const card_controller_1 = require("./infrastructure/card.controller");
const access_controller_1 = require("./infrastructure/access.controller");
const auth_service_1 = require("./application/auth.service");
const card_service_1 = require("./application/card.service");
const access_service_1 = require("./application/access.service");
const jwt_strategy_1 = require("./infrastructure/strategies/jwt.strategy");
const jwt_auth_guard_1 = require("./infrastructure/guards/jwt-auth.guard");
const user_domain_service_1 = require("./domain/services/user.domain-service");
const card_domain_service_1 = require("./domain/services/card.domain-service");
const access_domain_service_1 = require("./domain/services/access.domain-service");
const coop_jwt_strategy_1 = require("./infrastructure/strategies/coop-jwt.strategy");
const coop_jwt_auth_guard_1 = require("./infrastructure/guards/coop-jwt-auth.guard");
const database_module_1 = require("./infrastructure/database.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: 'access_secret',
                signOptions: { expiresIn: '15m' },
            }),
        ],
        controllers: [
            auth_controller_1.AuthController, card_controller_1.CardController, access_controller_1.AccessController
        ],
        providers: [
            auth_service_1.AuthService,
            card_service_1.CardService,
            access_service_1.AccessService,
            jwt_strategy_1.JwtStrategy,
            jwt_auth_guard_1.JwtAuthGuard,
            user_domain_service_1.UserDomainService,
            card_domain_service_1.CardDomainService,
            access_domain_service_1.AccessDomainService,
            coop_jwt_strategy_1.CoopJwtStrategy,
            coop_jwt_auth_guard_1.CoopJwtAuthGuard,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map