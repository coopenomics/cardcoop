import { Injectable } from '@nestjs/common';
import type { InitiateRegistrationDomainReposponseInterface } from '../interfaces/initiate-registration-domain.interface';
import type { InitiateLoginDomainReposponseInterface } from '../interfaces/initiate-login-domain.interface';
import type { CompleteLoginResponseDomainInterface } from '../interfaces/compete-login-domain.interface';
import { UserDomainService } from '../services/user.domain-service';
import type { LogoutInputDomainInterface } from '../interfaces/logout-input.interface';

@Injectable()
export class UserInteractor {
  constructor(private readonly userDomainService: UserDomainService) {}

  async initiateRegistration(
    email: string,
  ): Promise<InitiateRegistrationDomainReposponseInterface> {
    return this.userDomainService.initiateRegistration(email);
  }

  async completeRegistration(
    email: string,
    hash_key: string,
    uuid: string,
    salt: string,
  ): Promise<CompleteLoginResponseDomainInterface> {
    return this.userDomainService.completeRegistration(
      email,
      hash_key,
      uuid,
      salt,
    );
  }

  async initiateLogin(
    email: string,
  ): Promise<InitiateLoginDomainReposponseInterface> {
    return this.userDomainService.initiateLogin(email);
  }

  async completeLogin(
    email: string,
    hash_key: string,
    uuid: string,
  ): Promise<CompleteLoginResponseDomainInterface> {
    return this.userDomainService.completeLogin(email, hash_key, uuid);
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<CompleteLoginResponseDomainInterface> {
    return this.userDomainService.refreshAccessToken(refreshToken);
  }

  async logout(data: LogoutInputDomainInterface): Promise<void> {
    return this.userDomainService.logout(data);
  }
}
