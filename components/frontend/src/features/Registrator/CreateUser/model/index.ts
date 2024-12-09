import { api } from '../api';
import emailRegex from 'email-regex';
const emailValidator = emailRegex({ exact: true });

import { IGeneratedAccount, ISendStatement } from 'src/shared/lib/types/user';

import { useSessionStore } from 'src/entities/Session';
import { useGlobalStore } from 'src/shared/store';
import { COOPNAME } from 'src/shared/config';
import { DigitalDocument } from 'src/entities/Document';
import { IObjectedDocument } from 'src/shared/lib/types/document';
import {
  useCurrentUserStore,
} from 'src/entities/User';
import { useRegistratorStore } from 'src/entities/Registrator'
import { IEntrepreneurData, IIndividualData, IOrganizationData, IUserData } from 'src/shared/lib/types/user/IUserData';
import { Cooperative } from 'cooptypes';

export interface ICreateUser {
  email: string;
  entrepreneur_data?: IEntrepreneurData;
  individual_data?: IIndividualData;
  organization_data?: IOrganizationData;
  public_key: string;
  referer?: string;
  role: 'user';
  type: 'individual' | 'entrepreneur' | 'organization';
  username: string;
}

export function useCreateUser() {
  const store = useRegistratorStore().state


  async function sendStatementAndAgreements(): Promise<void> {
    const data: ISendStatement = {
      username: store.account.username,
      statement: store.statement,
      wallet_agreement: store.walletAgreement,
      privacy_agreement: store.privacyAgreement,
      signature_agreement: store.signatureAgreement,
      user_agreement: store.userAgreement
    };

    await api.sendStatement(data);
  }


  async function signStatement(): Promise<IObjectedDocument> {
    const data = {
      registry_id: Cooperative.Registry.ParticipantApplication.registry_id,
      signature: store.signature,
      skip_save: false,
      coopname: COOPNAME,
      username: store.account.username,
      links: [store.walletAgreement.hash, store.privacyAgreement.hash, store.signatureAgreement.hash, store.userAgreement.hash]
    }

    const document = await new DigitalDocument().generate<Cooperative.Registry.ParticipantApplication.Action>(data);
    const globalStore = useGlobalStore();
    const digital_signature = await globalStore.signDigest(document.hash);

    store.statement = {
      hash: document.hash,
      meta: document.meta,
      public_key: digital_signature.public_key,
      signature: digital_signature.signature,
    } as IObjectedDocument;

    return store.statement;
  }

  async function signPrivacyAgreement(): Promise<IObjectedDocument> {
    const data: Cooperative.Registry.PrivacyPolicy.Action= {
      registry_id: Cooperative.Registry.PrivacyPolicy.registry_id,
      coopname: COOPNAME,
      username: store.account.username,
    };

    const document = new DigitalDocument();
    await document.generate(data);
    await document.sign();

    store.privacyAgreement = document.signedDocument as IObjectedDocument;

    return store.privacyAgreement;
  }

  async function signSignatureAgreement(): Promise<IObjectedDocument> {
    const data: Cooperative.Registry.RegulationElectronicSignature.Action= {
      registry_id: Cooperative.Registry.RegulationElectronicSignature.registry_id,
      coopname: COOPNAME,
      username: store.account.username,
    };

    const document = new DigitalDocument();
    await document.generate(data);
    await document.sign();

    store.signatureAgreement = document.signedDocument as IObjectedDocument;

    return store.signatureAgreement;
  }


  async function signUserAgreement(): Promise<IObjectedDocument> {
    const data: Cooperative.Registry.UserAgreement.Action= {
      registry_id: Cooperative.Registry.UserAgreement.registry_id,
      coopname: COOPNAME,
      username: store.account.username,
    };

    const document = new DigitalDocument();
    await document.generate(data);
    await document.sign();

    store.userAgreement = document.signedDocument as IObjectedDocument;

    return store.userAgreement;
  }




  async function signWalletAgreement(): Promise<IObjectedDocument> {
    const data: Cooperative.Registry.WalletAgreement.Action= {
      registry_id: Cooperative.Registry.WalletAgreement.registry_id,
      coopname: COOPNAME,
      username: store.account.username,
    };

    const document = new DigitalDocument();
    await document.generate(data);
    await document.sign();

    store.walletAgreement = document.signedDocument as IObjectedDocument;

    console.log('walletAgreement: ', store.walletAgreement)

    return store.walletAgreement;
  }


  async function generateStatementWithoutSignature(username: string) {

    const document = await new DigitalDocument().generate<Cooperative.Registry.ParticipantApplication.Action>({
      signature: '',
      skip_save: true,
      coopname: COOPNAME,
      username,
      registry_id: Cooperative.Registry.ParticipantApplication.registry_id
  });

    return document;
  }

  async function createUser(
    email: string,
    userData: IUserData,
    account: IGeneratedAccount
  ): Promise<void> {

    const synthData = { type: userData.type } as any;

    if (synthData.type === 'individual') {
      synthData.individual_data = userData.individual_data;
    } else if (synthData.type === 'organization') {
      synthData.organization_data = userData.organization_data;
    } else if (synthData.type === 'entrepreneur') {
      synthData.entrepreneur_data = userData.entrepreneur_data;
    }
    const data: ICreateUser = {
      ...synthData,
      role: 'user',
      email,
      username: account.username,
      public_key: account.public_key,
    };

    const { user, tokens } = await api.createUser(data);

    const globalStore = useGlobalStore();
    const sessionStore = useSessionStore();

    await globalStore.setTokens(tokens);
    await globalStore.setWif(user.username, account.private_key);

    await sessionStore.init();

    const currentUser = useCurrentUserStore();
    await currentUser.loadProfile(user.username, COOPNAME);
  }

  function emailIsValid(email: string): boolean {
    return emailValidator.test(email);
  }

  async function emailIsExist(email: string): Promise<boolean> {
    return await api.emailIsExist(email);
  }

  function generateAccount(): IGeneratedAccount {
    const keyPair = api.generateKeys();
    const username = api.generateUsername();

    return {
      username,
      ...keyPair,
    };
  }

  return {
    emailIsValid,
    emailIsExist,
    generateAccount,
    createUser,
    generateStatementWithoutSignature,
    signStatement,
    sendStatementAndAgreements,
    signWalletAgreement,
    signPrivacyAgreement,
    signUserAgreement,
    signSignatureAgreement
  };
}
