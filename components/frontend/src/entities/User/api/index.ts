import { fetchTable, getAccountInfo, sendGET } from 'src/shared/api';
import {
  IBlockchainAccountResult,
  ICopenomicsAccount,
  IUserAccountData,
} from '../model';
import { RegistratorContract, SovietContract } from 'cooptypes';

async function loadBlockchainAccount(
  username: string
): Promise<IBlockchainAccountResult> {
  const account = (await getAccountInfo(username)) as IBlockchainAccountResult;
  return account;
}

async function loadCopenomicsAccount(
  username: string
): Promise<ICopenomicsAccount> {
  const organization = (
    await fetchTable(
      RegistratorContract.contractName.production,
      RegistratorContract.contractName.production,
      RegistratorContract.Tables.Cooperatives.tableName,
      username,
      username,
      1
    )
  )[0] as RegistratorContract.Tables.Cooperatives.ICooperative;

  const account = (
    await fetchTable(
      RegistratorContract.contractName.production,
      RegistratorContract.contractName.production,
      RegistratorContract.Tables.Accounts.tableName,
      username,
      username,
      1
    )
  )[0] as RegistratorContract.Tables.Accounts.IAccount;

  return {
    ...organization,
    ...account,
  };
}

async function loadParticipantAccount(
  username: string,
  coopname: string
): Promise<SovietContract.Tables.Participants.IParticipants> {
  const participant = (
    await fetchTable(
      SovietContract.contractName.production,
      coopname,
      SovietContract.Tables.Participants.tableName,
      username,
      username,
      1
    )
  )[0] as SovietContract.Tables.Participants.IParticipants;
  return participant;
}

async function loadUserAccount(username: string): Promise<IUserAccountData> {
  const user = (await sendGET('/v1/users/' + username, {})) as IUserAccountData;
  return user;
}

export const api = {
  loadBlockchainAccount,
  loadCopenomicsAccount,
  loadParticipantAccount,
  loadUserAccount,
};
