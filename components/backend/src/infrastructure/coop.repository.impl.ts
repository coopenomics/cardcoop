import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Coop } from '../domain/coop.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CoopRepository } from '../domain/coop.repository';

@Injectable()
export class CoopRepositoryImpl implements CoopRepository {
  constructor(
    @InjectRepository(Coop)
    private readonly repository: Repository<Coop>,
  ) {}

  async findByName(name: string): Promise<Coop | undefined> {
    return this.repository.findOne({ where: { name } });
  }
}
