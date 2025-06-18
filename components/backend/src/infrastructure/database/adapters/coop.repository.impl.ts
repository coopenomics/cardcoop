import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CoopRepository } from '../../../domain/repositories/coop.repository';
import { Coop } from 'src/domain/entities/coop.entity';
import { CoopORM } from '../entities/coop.orm-entity';

@Injectable()
export class CoopRepositoryImpl implements CoopRepository {
  constructor(
    @InjectRepository(CoopORM)
    private readonly repository: Repository<CoopORM>,
  ) {}

  async findByName(coopname: string): Promise<Coop | null> {
    const result = await this.repository.findOne({ where: { coopname } });
    if (result)
      return new Coop(result)
    else return null
  }
}
