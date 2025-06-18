import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ACCESS_REQUEST_REPOSITORY, AccessRequestRepository } from '../repositories/access-request.repository';
import { AccessRequest } from '../entities/access-request.entity';

@Injectable()
export class AccessDomainService {
  constructor(@Inject(ACCESS_REQUEST_REPOSITORY) private readonly accessRequestRepository: AccessRequestRepository) {}
  
  // Сохраняем зашифрованные данные и возвращаем уникальный идентификатор (ticket)
  async saveEncryptedCard(accessRequest: AccessRequest): Promise<string> {
    // Проверяем, существует ли уже AccessRequest для данной пары username и coopname
    const existingAccessRequest = await this.accessRequestRepository.findByUsernameAndCoopName(
      accessRequest.username,
      accessRequest.coopname,
    );
    
    await this.accessRequestRepository.save(accessRequest);
    
    return accessRequest.ticket;    
  }

  async getAccessRequestByTicket(ticket: string): Promise<AccessRequest | null> {
    const request = await this.accessRequestRepository.findByTicket(ticket);
    return request
  }
  
  async getAccessRequestByUsernameAndCoopname(username: string, coopname: string): Promise<AccessRequest> {
    const request = await this.accessRequestRepository.findByUsernameAndCoopName(username, coopname);
    
    if (!request) {
      throw new BadRequestException('В доступе отказано по причине того, что он был отозван или не выдан');
    }

    return request;
  }

  async revokeAccess(username: string, coopname: string): Promise<void> {
    await this.accessRequestRepository.deleteByUsernameAndCoopName(username, coopname);
  }

  async listAccesses(username: string): Promise<AccessRequest[]> {
    return this.accessRequestRepository.findByUsername(username);
  }
}
