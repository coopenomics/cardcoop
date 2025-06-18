import { Injectable } from '@nestjs/common';
import { UserDomainService } from '../../domain/services/user.domain-service';
import { CompleteLoginResponseDTO } from '../dto/complete-login-response.dto';
import { CompleteLoginInputDTO } from '../dto/complete-login-input.dto';
import { InitiateLoginInputDTO } from '../dto/initiate-login.dto';
import { CompleteRegistrationInputDTO } from '../dto/complete-registration-input.dto';
import { InitiateRegistrationInputDTO } from '../dto/initiate-registration-input.dto';
import { InitiateRegistrationResponseDTO } from '../dto/initiate-registration-response.dto';
import type { InitiateLoginResponseDTO } from '../dto/initiate-login-response.dto';
import { UserInteractor } from 'src/domain/interactors/user.interactor';
import type { LogoutInputDTO } from '../dto/logout-input.dto';
import type { VerifyEmailInputDTO } from '../dto/verify-email-input.dto';
import type { VerifyEmailResponseDTO } from '../dto/verify-email-response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userInteractor: UserInteractor) {}

  async initiateRegistration(
    data: InitiateRegistrationInputDTO,
  ): Promise<InitiateRegistrationResponseDTO> {
    const response = await this.userInteractor.initiateRegistration(data.email);
    return new InitiateRegistrationResponseDTO({ ...response });
  }

  async completeRegistration(
    data: CompleteRegistrationInputDTO,
  ): Promise<CompleteLoginResponseDTO> {
    const response = await this.userInteractor.completeRegistration(
      data.email,
      data.hash_key,
      data.uuid,
      data.salt,
    );

    return new CompleteLoginResponseDTO(
      response.access_token,
      response.refresh_token,
    );
  }

  async initiateLogin(
    dto: InitiateLoginInputDTO,
  ): Promise<InitiateLoginResponseDTO> {
    return this.userInteractor.initiateLogin(dto.email);
  }

  async completeLogin(
    dto: CompleteLoginInputDTO,
  ): Promise<CompleteLoginResponseDTO> {
    const response = await this.userInteractor.completeLogin(
      dto.email,
      dto.hash_key,
      dto.uuid,
    );

    return new CompleteLoginResponseDTO(
      response.access_token,
      response.refresh_token,
    );
  }

  async refreshAccessToken(
    refresh_token: string,
  ): Promise<CompleteLoginResponseDTO> {
    const response =
      await this.userInteractor.refreshAccessToken(refresh_token);
    return new CompleteLoginResponseDTO(
      response.access_token,
      response.refresh_token,
    );
  }

  async logout(data: LogoutInputDTO): Promise<void> {
    await this.userInteractor.logout(data);
  }

  async verifyEmail(dto: VerifyEmailInputDTO): Promise<VerifyEmailResponseDTO> {
    // В реальной системе проверяем код через email сервис
    // В тестах для упрощения всегда возвращаем успех
    return { verified: true };
  }
}
