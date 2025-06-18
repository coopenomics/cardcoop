import { Module } from "@nestjs/common";
import { BlockchainModule } from "./blockchain/blockchain.module";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "./config/config.module";

@Module({
  imports: [
    BlockchainModule,
    DatabaseModule,
    ConfigModule
  ],
  exports: [
    BlockchainModule,
    DatabaseModule,
    ConfigModule
  ],
})

export class InfrastructureModule {}
