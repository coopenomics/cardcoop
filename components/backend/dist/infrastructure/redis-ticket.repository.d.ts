import { TicketRepository } from '../domain/ticket.repository';
export declare class RedisTicketRepository implements TicketRepository {
    private redis;
    constructor();
    save(ticket: string, userId: string): Promise<void>;
    getUserId(ticket: string): Promise<string | null>;
    delete(ticket: string): Promise<void>;
}
