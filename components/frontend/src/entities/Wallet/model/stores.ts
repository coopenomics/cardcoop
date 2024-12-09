import { defineStore } from 'pinia';
import {
  IWalletData,
  IDepositData,
  IWithdrawData,
  ExtendedProgramWalletData,
  IPaymentMethodData,
} from './types';
import { ILoadUserWallet } from './types';
import { Ref, ref } from 'vue';
import { CURRENCY } from 'src/shared/config';
import type { SovietContract } from 'cooptypes';

const namespace = 'wallet';

interface IWalletStore {
  /*  доменный интерфейс кошелька пользователя */
  wallet: Ref<IWalletData>;
  program_wallets: Ref<ExtendedProgramWalletData[]>;
  deposits: Ref<IDepositData[]>;
  withdraws: Ref<IWithdrawData[]>;
  methods: Ref<IPaymentMethodData[]>;
  agreements: Ref<SovietContract.Tables.Agreements.IAgreement[]>;

  loadUserWalet: (params: ILoadUserWallet) => Promise<void>;

}

export const useWalletStore = defineStore(namespace, (): IWalletStore => {
  const wallet = ref<IWalletData>({
    username: '',
    coopname: '',
    available: `0.0000 ${CURRENCY}`,
    blocked: `0.0000 ${CURRENCY}`,
    minimum: `0.0000 ${CURRENCY}`,
    initial: `0.0000 ${CURRENCY}`,
  });

  const deposits = ref<IDepositData[]>([]);
  const withdraws = ref<IWithdrawData[]>([]);
  const program_wallets = ref<ExtendedProgramWalletData[]>([]);
  const methods = ref<IPaymentMethodData[]>([]);
  const agreements = ref<SovietContract.Tables.Agreements.IAgreement[]>([]);


  const loadUserWalet = async (params: ILoadUserWallet) => {

    const createEmptyWallet = (): IWalletData => ({
      username: '',
      coopname: '',
      available: `0.0000 ${CURRENCY}`,
      blocked: `0.0000 ${CURRENCY}`,
      minimum: `0.0000 ${CURRENCY}`,
      initial: `0.0000 ${CURRENCY}`,
    });

    wallet.value = createEmptyWallet();

  };


  return {
    wallet,
    program_wallets,
    deposits,
    withdraws,
    methods,
    agreements,
    loadUserWalet,
  };
});
