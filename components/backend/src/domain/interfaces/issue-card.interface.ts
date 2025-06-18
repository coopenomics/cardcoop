/**
 * Интерфейс для описания данных, необходимых для выпуска карты
 */
export interface IssueCardDomainInterface {
  user_id: string; // ID пользователя-владельца
  username: string; // Имя пользователя в кооперативе
  coop_name: string; // Название кооператива
  encrypted_key: string; // Зашифрованный ключ для доступа к кооперативу
  encrypted_data: string; // Зашифрованные приватные данные
  meta: {
    version: number; // Версия формата данных
    card_type?: string; // Тип карты (standard, premium и т.д.)
    valid_until?: Date; // Дата окончания действия карты
  };
}
