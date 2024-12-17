import { Module } from "@nestjs/common";
import { BlockchainModule } from "./blockchain/blockchain.module";
import { DatabaseModule } from "./database/database.module";

@Module({
  imports: [
    BlockchainModule,
    DatabaseModule
  ],
  exports: [
    BlockchainModule,
    DatabaseModule
  ],
})

export class InfrastructureModule {}
