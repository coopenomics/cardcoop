/**
 * Список таблиц в распределенной базе данных EOSIO.
 */
export enum TablesList {
  Wallets = 'wallets', //* Таблица кошелька пайщиков кооператива */
  Deposits = 'deposits', //* Таблица депозитов пайщиков кооператива */
  Withdraws = 'withdraws', //* Таблица возвратов пайщиков кооператива */
  ProgramWallets = 'progwallets', //* Таблица кошельков программ кооператива */
  CoopPrograms = 'progcomarket', //* Таблица балансов ЦПП пайщика кооператива */
  CoopMarketRequests = 'exchange',
  CooperativeAddresses = 'addresses',
}
