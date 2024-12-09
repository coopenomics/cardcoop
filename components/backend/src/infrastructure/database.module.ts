import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Card } from '../domain/card.entity';
import { AccessRequest } from '../domain/access-request.entity';
import { Coop } from '../domain/coop.entity';
import { UserRepositoryImpl } from './user.repository.impl';
import { CardRepositoryImpl } from './card.repository.impl';
import { AccessRequestRepositoryImpl } from './access-request.repository.impl';
import { CoopRepositoryImpl } from './coop.repository.impl';
import { USER_REPOSITORY } from '../domain/user.repository';
import { CARD_REPOSITORY } from '../domain/card.repository';
import { ACCESS_REQUEST_REPOSITORY } from '../domain/access-request.repository';
import { COOP_REPOSITORY } from '../domain/coop.repository';
import type { DataSource } from 'typeorm';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'cardcoop',
      synchronize: true,
      entities: [
        User, 
        Card, 
        AccessRequest, 
        Coop
      ],
    }),
    TypeOrmModule.forFeature([
      User, 
      Card, 
      AccessRequest, 
      Coop
    ]),
  ],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
    {
      provide: CARD_REPOSITORY,
      useClass: CardRepositoryImpl,
    },
    {
      provide: ACCESS_REQUEST_REPOSITORY,
      useClass: AccessRequestRepositoryImpl,
    },
    {
      provide: COOP_REPOSITORY,
      useClass: CoopRepositoryImpl,
    },
  ],
  exports: [
    TypeOrmModule,
    USER_REPOSITORY,
    CARD_REPOSITORY,
    ACCESS_REQUEST_REPOSITORY,
    COOP_REPOSITORY,
  ],
})
export class DatabaseModule {}
