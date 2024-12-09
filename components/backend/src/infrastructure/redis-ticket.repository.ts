import { TicketRepository } from '../domain/ticket.repository';
import Redis from 'ioredis';

export class RedisTicketRepository implements TicketRepository {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
      password: process.env.REDIS_PASSWORD,
    });
  }

  async save(ticket: string, userId: string): Promise<void> {
    // Устанавливаем тикет с временем жизни (например, 5 минут)
    await this.redis.set(ticket, userId, 'EX', 300);
  }

  async getUserId(ticket: string): Promise<string | null> {
    const userId = await this.redis.get(ticket);
    return userId;
  }

  async delete(ticket: string): Promise<void> {
    await this.redis.del(ticket);
  }
}
