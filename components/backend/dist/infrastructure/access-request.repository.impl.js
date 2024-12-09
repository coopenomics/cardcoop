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
exports.AccessRequestRepositoryImpl = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const access_request_entity_1 = require("../domain/access-request.entity");
const typeorm_2 = require("@nestjs/typeorm");
let AccessRequestRepositoryImpl = class AccessRequestRepositoryImpl {
    constructor(repository) {
        this.repository = repository;
    }
    async create(request) {
        return this.repository.save(request);
    }
    async update(request) {
        return this.repository.save(request);
    }
    async findByAccessId(accessId) {
        return this.repository.findOne({ where: { accessId } });
    }
    async findByUsernameAndCoopName(username, coopName) {
        return this.repository.findOne({ where: { username, coopName } });
    }
    async deleteByUsernameAndCoopName(username, coopName) {
        await this.repository.delete({ username, coopName });
    }
    async findByUsername(username) {
        return this.repository.find({ where: { username } });
    }
};
exports.AccessRequestRepositoryImpl = AccessRequestRepositoryImpl;
exports.AccessRequestRepositoryImpl = AccessRequestRepositoryImpl = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(access_request_entity_1.AccessRequest)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], AccessRequestRepositoryImpl);
//# sourceMappingURL=access-request.repository.impl.js.map