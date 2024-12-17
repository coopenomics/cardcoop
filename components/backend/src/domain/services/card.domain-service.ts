import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CARD_REPOSITORY, CardRepository } from '../repositories/card.repository';
import { Card } from '../entities/card.entity';
import type { IssueCardDomainInterface } from '../interfaces/issue-card.interface';
import { sha256 } from 'src/utils/createHash';
import { v4 } from 'uuid';

@Injectable()
export class CardDomainService {
  constructor(@Inject(CARD_REPOSITORY) private readonly cardRepository: CardRepository) {}
  
  async issueCard(data: IssueCardDomainInterface): Promise<Card> {
    // хэшируем данные карты для использования в процессе верификации
    // будем передавать в объект user контракта registrator как обязательный параметр при регистрации
    const data_hash = sha256(data.encrypted_data)
    
    // создаём карту
    const card = new Card({
      id: v4(),
      username: data.username,
      encrypted_data: data.encrypted_data,
      encrypted_key: data.encrypted_key,
      userId: data.userId,
      data_hash,
      meta: {...data.meta, issued_at: new Date()}
    });
    
    // ищем карту пользователя с указанным username
    const exist = await this.cardRepository.findByUsername(card.username)
    
    if (exist && exist.userId != data.userId)
      throw new ForbiddenException('Нельзя присвоить чужую карту!')
  
    // если найдена - перевыпускаем, заменяя id на существующий
    if (exist)
      card.id = exist.id

    // сохраняем карту в репозитории
    return this.cardRepository.save(card);
  }
}
