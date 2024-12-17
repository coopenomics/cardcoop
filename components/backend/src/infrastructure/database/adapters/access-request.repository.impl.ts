import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AccessRequest } from '../../../domain/entities/access-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessRequestRepository } from '../../../domain/repositories/access-request.repository';

@Injectable()
export class AccessRequestRepositoryImpl implements AccessRequestRepository {
  constructor(
    @InjectRepository(AccessRequest)
    private readonly repository: Repository<AccessRequest>,
  ) {}

  async save(request: AccessRequest ): Promise<AccessRequest> {
    return this.repository.save(request);
  }
  
  async findByTicket(ticket: string): Promise<AccessRequest | null> {
    return this.repository.findOne({ where: { ticket } });
  }
 
  async findByUsernameAndCoopName(username: string, coopname: string): Promise<AccessRequest | null> {
    return this.repository.findOne({ where: { username, coopname } });
  }

  async deleteByUsernameAndCoopName(username: string, coopname: string): Promise<void> {
    await this.repository.delete({ username, coopname });
  }

  async findByUsername(username: string): Promise<AccessRequest[]> {
    return this.repository.find({ where: { username } });
  }
}
