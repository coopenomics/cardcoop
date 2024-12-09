"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisTicketRepository = void 0;
const ioredis_1 = require("ioredis");
class RedisTicketRepository {
    constructor() {
        this.redis = new ioredis_1.default({
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT, 10),
            password: process.env.REDIS_PASSWORD,
        });
    }
    async save(ticket, userId) {
        await this.redis.set(ticket, userId, 'EX', 300);
    }
    async getUserId(ticket) {
        const userId = await this.redis.get(ticket);
        return userId;
    }
    async delete(ticket) {
        await this.redis.del(ticket);
    }
}
exports.RedisTicketRepository = RedisTicketRepository;
//# sourceMappingURL=redis-ticket.repository.js.map