export interface TicketRepository {
  save(ticket: string, userId: string): Promise<void>;
  getUserId(ticket: string): Promise<string | null>;
  delete(ticket: string): Promise<void>;
}
