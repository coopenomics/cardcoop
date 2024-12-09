import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AccessRequest } from '../domain/access-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessRequestRepository } from '../domain/access-request.repository';

@Injectable()
export class AccessRequestRepositoryImpl implements AccessRequestRepository {
  constructor(
    @InjectRepository(AccessRequest)
    private readonly repository: Repository<AccessRequest>,
  ) {}

  async create(request: AccessRequest ): Promise<AccessRequest> {
    return this.repository.save(request);
  }
  
  async update(request: AccessRequest): Promise<AccessRequest> {
    return this.repository.save(request);
  }
 
  async findByAccessId(accessId: string): Promise<AccessRequest | undefined> {
    return this.repository.findOne({ where: { accessId } });
  }
 
  async findByUsernameAndCoopName(username: string, coopName: string): Promise<AccessRequest | undefined> {
    return this.repository.findOne({ where: { username, coopName } });
  }

  async deleteByUsernameAndCoopName(username: string, coopName: string): Promise<void> {
    await this.repository.delete({ username, coopName });
  }

  async findByUsername(username: string): Promise<AccessRequest[]> {
    return this.repository.find({ where: { username } });
  }
}
