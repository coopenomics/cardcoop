import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserORM } from './entities/user.entity';
import { CardORM } from './entities/card.orm-entity';
import { CoopORM } from './entities/coop.orm-entity';
import { UserRepositoryImpl } from './adapters/user.repository.impl';
import { CardRepositoryImpl } from './adapters/card.repository.impl';
import { CoopRepositoryImpl } from './adapters/coop.repository.impl';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { CARD_REPOSITORY } from '../../domain/repositories/card.repository';
import { ACCESS_REQUEST_REPOSITORY } from '../../domain/repositories/access-request.repository';
import { COOP_REPOSITORY } from '../../domain/repositories/coop.repository';
import { UUID_TOKEN_REPOSITORY } from 'src/domain/repositories/uuid-token.repository';
import { JWT_TOKEN_REPOSITORY } from 'src/domain/repositories/jwt-token.repository';
import { TypeormUuidTokenRepository } from './adapters/uuid-token.repository.impl';
import { TypeormJwtTokenRepository } from './adapters/jwt-token.repository.impl';
import { UuidTokenORM } from 'src/infrastructure/database/entities/uuid-token.entity';
import { JwtTokenORM } from 'src/infrastructure/database/entities/jwt-token.entity';
import { AccessRequestORM } from './entities/access-request.orm-entity';
import { AccessRequestRepositoryImpl } from './adapters/access-request.repository.impl';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';
import { PrivateDataORM } from './entities/private-data.orm-entity';
import { PrivateDataRepositoryImpl } from './adapters/private-data.repository.impl';
import { PRIVATE_DATA_REPOSITORY } from 'src/domain/repositories/private-data.repository';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.dbHost,
        port: configService.dbPort,
        username: configService.dbUsername,
        password: configService.dbPassword,
        database: configService.dbDatabase,
        synchronize: true,
        entities: [
          UserORM,
          CardORM,
          AccessRequestORM,
          CoopORM,
          UuidTokenORM,
          JwtTokenORM,
          PrivateDataORM,
        ],
      }),
    }),
    TypeOrmModule.forFeature([
      UserORM,
      CardORM,
      AccessRequestORM,
      CoopORM,
      UuidTokenORM,
      JwtTokenORM,
      PrivateDataORM,
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
    {
      provide: UUID_TOKEN_REPOSITORY,
      useClass: TypeormUuidTokenRepository,
    },
    {
      provide: JWT_TOKEN_REPOSITORY,
      useClass: TypeormJwtTokenRepository,
    },
    {
      provide: PRIVATE_DATA_REPOSITORY,
      useClass: PrivateDataRepositoryImpl,
    },
  ],
  exports: [
    TypeOrmModule,
    USER_REPOSITORY,
    CARD_REPOSITORY,
    ACCESS_REQUEST_REPOSITORY,
    COOP_REPOSITORY,
    UUID_TOKEN_REPOSITORY,
    JWT_TOKEN_REPOSITORY,
    PRIVATE_DATA_REPOSITORY,
  ],
})
export class DatabaseModule {}
