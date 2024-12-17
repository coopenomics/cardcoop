import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Coop } from '../../../domain/entities/coop.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CoopRepository } from '../../../domain/repositories/coop.repository';

@Injectable()
export class CoopRepositoryImpl implements CoopRepository {
  constructor(
    @InjectRepository(Coop)
    private readonly repository: Repository<Coop>,
  ) {}

  async findByName(coopname: string): Promise<Coop | null> {
    return this.repository.findOne({ where: { coopname } });
  }
}
