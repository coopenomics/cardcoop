"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../domain/user.entity");
const card_entity_1 = require("../domain/card.entity");
const access_request_entity_1 = require("../domain/access-request.entity");
const coop_entity_1 = require("../domain/coop.entity");
const user_repository_impl_1 = require("./user.repository.impl");
const card_repository_impl_1 = require("./card.repository.impl");
const access_request_repository_impl_1 = require("./access-request.repository.impl");
const coop_repository_impl_1 = require("./coop.repository.impl");
const user_repository_1 = require("../domain/user.repository");
const card_repository_1 = require("../domain/card.repository");
const access_request_repository_1 = require("../domain/access-request.repository");
const coop_repository_1 = require("../domain/coop.repository");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: '127.0.0.1',
                port: 5432,
                username: 'postgres',
                password: 'postgres',
                database: 'cardcoop',
                synchronize: true,
                entities: [
                    user_entity_1.User,
                    card_entity_1.Card,
                    access_request_entity_1.AccessRequest,
                    coop_entity_1.Coop
                ],
            }),
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                card_entity_1.Card,
                access_request_entity_1.AccessRequest,
                coop_entity_1.Coop
            ]),
        ],
        providers: [
            {
                provide: user_repository_1.USER_REPOSITORY,
                useClass: user_repository_impl_1.UserRepositoryImpl,
            },
            {
                provide: card_repository_1.CARD_REPOSITORY,
                useClass: card_repository_impl_1.CardRepositoryImpl,
            },
            {
                provide: access_request_repository_1.ACCESS_REQUEST_REPOSITORY,
                useClass: access_request_repository_impl_1.AccessRequestRepositoryImpl,
            },
            {
                provide: coop_repository_1.COOP_REPOSITORY,
                useClass: coop_repository_impl_1.CoopRepositoryImpl,
            },
        ],
        exports: [
            typeorm_1.TypeOrmModule,
            user_repository_1.USER_REPOSITORY,
            card_repository_1.CARD_REPOSITORY,
            access_request_repository_1.ACCESS_REQUEST_REPOSITORY,
            coop_repository_1.COOP_REPOSITORY,
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map