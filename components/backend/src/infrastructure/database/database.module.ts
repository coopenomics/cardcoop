import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/entities/user.entity';
import { Card } from '../../domain/entities/card.entity';
import { AccessRequest } from '../../domain/entities/access-request.entity';
import { Coop } from '../../domain/entities/coop.entity';
import { UserRepositoryImpl } from './adapters/user.repository.impl';
import { CardRepositoryImpl } from './adapters/card.repository.impl';
import { AccessRequestRepositoryImpl } from './adapters/access-request.repository.impl';
import { CoopRepositoryImpl } from './adapters/coop.repository.impl';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { CARD_REPOSITORY } from '../../domain/repositories/card.repository';
import { ACCESS_REQUEST_REPOSITORY } from '../../domain/repositories/access-request.repository';
import { COOP_REPOSITORY } from '../../domain/repositories/coop.repository';
import { Token } from 'src/domain/entities/token.entity';
import { TOKEN_REPOSITORY } from 'src/domain/repositories/token.repository';
import { TokenRepositoryImpl } from './adapters/token.repository.impl';

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
        Coop,
        Token
      ],
    }),
    TypeOrmModule.forFeature([
      User, 
      Card, 
      AccessRequest, 
      Coop,
      Token
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
      provide: TOKEN_REPOSITORY,
      useClass: TokenRepositoryImpl,
    },
    
  ],
  exports: [
    TypeOrmModule,
    USER_REPOSITORY,
    CARD_REPOSITORY,
    ACCESS_REQUEST_REPOSITORY,
    COOP_REPOSITORY,
    TOKEN_REPOSITORY
  ],
})
export class DatabaseModule {}
