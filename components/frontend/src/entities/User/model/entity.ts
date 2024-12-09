// UserEntity.ts
import {
  IUserAccountData,
  IBlockchainAccountResult,
  ICopenomicsAccount,
} from './types';
import { Ref, ref } from 'vue';
import { api } from '../api';
import { SovietContract } from 'cooptypes';

export class UserEntity {
  username: Ref<string> = ref('');

  blockchainAccount = ref<IBlockchainAccountResult | null>(null);
  copenomicsAccount = ref<ICopenomicsAccount | null>(null);
  participantAccount =
    ref<SovietContract.Tables.Participants.IParticipants | null>(null);
  userAccount = ref<IUserAccountData | null>(null);

  async loadProfile(username: string, coopname: string): Promise<void> {
    this.username.value = username;
    await this.loadPrivateProfile(username);

    if (this.userAccount.value?.is_registered)
      await this.loadPublicProfile(username, coopname);
  }

  async loadPublicProfile(username: string, coopname: string): Promise<void> {
    this.blockchainAccount.value = await api.loadBlockchainAccount(username);
    this.copenomicsAccount.value = await api.loadCopenomicsAccount(username);
    this.participantAccount.value = await api.loadParticipantAccount(
      username,
      coopname
    );
  }

  async loadPrivateProfile(username: string): Promise<void> {
    this.userAccount.value = await api.loadUserAccount(username);
  }

  clearAccount(): void {
    this.blockchainAccount.value = null;
    this.copenomicsAccount.value = null;
    this.userAccount.value = null;
    this.participantAccount.value = null;
  }
}
