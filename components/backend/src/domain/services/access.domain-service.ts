import { Inject, Injectable } from '@nestjs/common';
import { ACCESS_REQUEST_REPOSITORY, AccessRequestRepository } from '../access-request.repository';
import { AccessRequest } from '../access-request.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AccessDomainService {
  constructor(@Inject(ACCESS_REQUEST_REPOSITORY) private readonly accessRequestRepository: AccessRequestRepository) {}
  
  // Сохраняем зашифрованные данные и возвращаем уникальный идентификатор (ticket)
  async saveEncryptedData(accessRequest: AccessRequest): Promise<string> {
    // Проверяем, существует ли уже AccessRequest для данной пары username и coopName
    const existingAccessRequest = await this.accessRequestRepository.findByUsernameAndCoopName(
      accessRequest.username,
      accessRequest.coopName,
    );

    if (existingAccessRequest) {
      // Обновляем зашифрованные данные и возвращаем существующий accessId (ticket)
      existingAccessRequest.encryptedData = accessRequest.encryptedData;
      await this.accessRequestRepository.update(existingAccessRequest);
      return existingAccessRequest.accessId;
    } else {
      // Генерируем новый accessId (ticket)
      const accessId = uuidv4();
      accessRequest.accessId = accessId;
      await this.accessRequestRepository.create(accessRequest);
      return accessId;
    }
  }

  // Получаем AccessRequest по accessId (ticket)
  async getAccessRequestByAccessId(accessId: string): Promise<AccessRequest | undefined> {
    return this.accessRequestRepository.findByAccessId(accessId);
  }
  

  async getEncryptedData(username: string, coopName: string): Promise<AccessRequest> {
    const request = await this.accessRequestRepository.findByUsernameAndCoopName(username, coopName);
    if (!request) {
      throw new Error('Access not granted');
    }

    return request;
  }

  async revokeAccess(username: string, coopName: string): Promise<void> {
    await this.accessRequestRepository.deleteByUsernameAndCoopName(username, coopName);
  }

  async listAccesses(username: string): Promise<AccessRequest[]> {
    return this.accessRequestRepository.findByUsername(username);
  }
}
