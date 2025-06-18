/**
 * Модуль инфраструктуры (Infrastructure Layer) - внешние зависимости и сервисы.
 *
 * Ответственность:
 * - Взаимодействие с внешними системами (БД, блокчейн, API)
 * - Реализация интерфейсов доменного слоя (репозитории, сервисы)
 * - Управление конфигурацией приложения
 *
 * Компоненты:
 * - BlockchainModule: Взаимодействие с блокчейном
 * - DatabaseModule: Хранение и доступ к данным
 * - ConfigModule: Конфигурация приложения
 */
import { Module } from '@nestjs/common';
import { BlockchainModule } from './blockchain/blockchain.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [BlockchainModule, DatabaseModule, ConfigModule],
  exports: [BlockchainModule, DatabaseModule, ConfigModule],
})
export class InfrastructureModule {}
