import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AccessRequestORM } from '../entities/access-request.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessRequestRepository } from '../../../domain/repositories/access-request.repository';
import { AccessRequest } from 'src/domain/entities/access-request.entity';

@Injectable()
export class AccessRequestRepositoryImpl implements AccessRequestRepository {
  constructor(
    @InjectRepository(AccessRequestORM)
    private readonly repository: Repository<AccessRequestORM>,
  ) {}

  async save(request: AccessRequest): Promise<AccessRequest> {
    const result = await this.repository.save(request);
    return new AccessRequest(result)
  }
  
  async findByTicket(ticket: string): Promise<AccessRequest | null> {
    const request = await this.repository.findOne({ where: { ticket } });

    if (request)
      return new AccessRequest(request)
    else return null
  }
 
  async findByUsernameAndCoopName(username: string, coopname: string): Promise<AccessRequest | null> {
    const result = await this.repository.findOne({ where: { username, coopname } });
    if (result)
      return new AccessRequest(result)
    else return null
  }

  async deleteByUsernameAndCoopName(username: string, coopname: string): Promise<void> {
    await this.repository.delete({ username, coopname });
  }

  async findByUsername(username: string): Promise<AccessRequest[]> {
    const result = await this.repository.find({ where: { username } });
    return result.map((item) => new AccessRequest(item));
  }
}
