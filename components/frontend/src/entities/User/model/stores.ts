// stores.ts
import { SovietContract } from 'cooptypes';
import { defineStore } from 'pinia';
import { computed, ComputedRef, Ref } from 'vue';
import { UserEntity } from './entity';
import {
  IBlockchainAccountResult,
  ICopenomicsAccount,
  IUserAccountData,
} from './types';

interface IUserStore {
  //методы
  loadProfile(username: string, coopname: string): Promise<void>;
  clearAccount: () => void;
  //данные
  username: Ref<string>;
  blockchainAccount: Ref<IBlockchainAccountResult | null>;
  copenomicsAccount: Ref<ICopenomicsAccount | null>;
  participantAccount: Ref<SovietContract.Tables.Participants.IParticipants | null>;
  userAccount: Ref<IUserAccountData | null>;
  isRegistrationComplete: ComputedRef<boolean>;
  isChairman: ComputedRef<boolean>;
}

const namespaceCurrentUser = 'currentUser';
export const useCurrentUserStore = defineStore(
  namespaceCurrentUser,
  (): IUserStore => {
    const userEntity = new UserEntity();

    return {
      username: userEntity.username,
      clearAccount: () => userEntity.clearAccount(),
      loadProfile: (username: string, coopname: string) =>
        userEntity.loadProfile(username, coopname),
      blockchainAccount: userEntity.blockchainAccount,
      copenomicsAccount: userEntity.copenomicsAccount,
      userAccount: userEntity.userAccount,
      participantAccount: userEntity.participantAccount,
      isRegistrationComplete: computed(
        () =>
          (userEntity.userAccount.value || false) &&
          userEntity.participantAccount.value != null
      ),
      isChairman: computed(() => userEntity.userAccount.value?.role === 'chairman')
    };
  }
);

const namespaceAnyUser = 'anyUser';
export const useAnyUserStore = defineStore(namespaceAnyUser, (): IUserStore => {
  const userEntity = new UserEntity();

  return {
    username: userEntity.username,
    clearAccount: () => userEntity.clearAccount(),
    loadProfile: (username: string, coopname: string) =>
      userEntity.loadProfile(username, coopname),
    blockchainAccount: userEntity.blockchainAccount,
    copenomicsAccount: userEntity.copenomicsAccount,
    userAccount: userEntity.userAccount,
    participantAccount: userEntity.participantAccount,
    isRegistrationComplete: computed(
      () =>
        (userEntity.userAccount.value || false) &&
        userEntity.participantAccount.value != null
    ),
    isChairman: computed(() => userEntity.userAccount.value?.role === 'chairman')
  };
});
