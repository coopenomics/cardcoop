// store/global.ts
import { Action, PrivateKey } from '@wharfkit/antelope';
import { defineStore } from 'pinia';
import { ref, Ref } from 'vue';
import { decrypt, encrypt, hashSHA256 } from '../api/crypto';
import { COOPNAME } from '../config';
import { IMessageSignature } from '../lib/types/crypto';
import { useSessionStore } from 'src/entities/Session';
import { TransactResult } from '@wharfkit/session';
import { readBlockchain } from '../api';
import { ITokens } from '../lib/types/user';
import { getFromIndexedDB, setToIndexedDB } from '../api/indexDB';
import { setToken } from '../api/client';

interface IGlobalStore {
  hasCreditials: Ref<boolean>;
  username: Ref<string>;
  tokens: Ref<ITokens | undefined>;
  wif: Ref<PrivateKey | undefined>;
  setWif: (newUsername: string, key: string) => Promise<void>;
  setTokens: (newTokens: ITokens) => Promise<void>;
  logout: () => Promise<void>;
  init: () => void;
  signDigest: (digest: string) => IMessageSignature;
  hashMessage: (message: string | Uint8Array) => Promise<string>;
  formActionFromAbi: (action: any) => any;
  transact: (
    actionOrActions: any | any[]
  ) => Promise<TransactResult | undefined>;
}

export const useGlobalStore = defineStore('global', (): IGlobalStore => {
  const username = ref<string>('');
  const wif = ref<PrivateKey | undefined>(undefined);
  const hasCreditials = ref(false);
  const tokens = ref<ITokens | undefined>(undefined);

  const password = ''; // это временное намеренное решение. Позже заменим на пользовательский пин-код.

  // Инициализация
  const init = async () => {

    try {
      // Получите зашифрованный ключ и токены из хранилища
      const encrypted_key = await getFromIndexedDB(
        COOPNAME,
        'store',
        'encrypted_key'
      );
      const encryptedTokens = await getFromIndexedDB(
        COOPNAME,
        'store',
        'encryptedTokens'
      );
      const encryptedUsername = await getFromIndexedDB(
        COOPNAME,
        'store',
        'encryptedUsername'
      );

      // Если ключ или токены не найдены, выбросите ошибку
      if (!encrypted_key || !encryptedTokens || !encryptedUsername) {
        return;
      }

      // Расшифруйте ключ и токены
      const decryptedKey = await decrypt(encrypted_key, password);
      const decryptedTokens = await decrypt(encryptedTokens, password);
      const decryptedUsername = await decrypt(encryptedUsername, password);

      // Установите расшифрованный ключ и токены
      wif.value = PrivateKey.fromString(decryptedKey);
      tokens.value = JSON.parse(decryptedTokens);
      username.value = decryptedUsername;

      // if (NODE_ENV === 'development')
      //   console.log('tokens: ', tokens)

      // Установите hasCreditials в true
      hasCreditials.value = true;
      console.log('on init', tokens.value?.access.token)
      if (tokens.value?.access.token){
        setToken(tokens.value.access.token)
      }


    } catch (error: any) {
      await setToIndexedDB(COOPNAME, 'store', 'encrypted_key', '');
      await setToIndexedDB(COOPNAME, 'store', 'encryptedUsername', '');
      await setToIndexedDB(COOPNAME, 'store', 'encryptedTokens', '');
      throw new Error('Ошибка авторизации. Войдите повторно.');
    }
  };

  const setWif = async (newUsername: string, key: string) => {
    const encrypted_key = await encrypt(key, password);
    const encryptedUsername = await encrypt(newUsername, password);

    await setToIndexedDB(COOPNAME, 'store', 'encrypted_key', encrypted_key);
    await setToIndexedDB(
      COOPNAME,
      'store',
      'encryptedUsername',
      encryptedUsername
    );

    wif.value = PrivateKey.fromString(key);
    username.value = newUsername;
  };

  const setTokens = async (newTokens: ITokens) => {
    const encryptedTokens = await encrypt(JSON.stringify(newTokens), password);
    await setToIndexedDB(COOPNAME, 'store', 'encryptedTokens', encryptedTokens);
    tokens.value = newTokens;
  };

  const logout = async () => {
    username.value = '';
    wif.value = undefined;
    hasCreditials.value = false;
    tokens.value = undefined;
    await setToIndexedDB(COOPNAME, 'store', 'encrypted_key', '');
    await setToIndexedDB(COOPNAME, 'store', 'encryptedUsername', '');
    await setToIndexedDB(COOPNAME, 'store', 'encryptedTokens', '');
  };

  const signDigest = (digest: string): IMessageSignature => {
    if (!wif.value) throw new Error('ключ не найден');

    const signed = wif.value.signDigest(digest);
    const verified = signed.verifyDigest(digest, wif.value.toPublic());

    if (!verified) throw new Error('Подпись не верифицирована');

    const result: IMessageSignature = {
      message: digest,
      signature: signed.toString(),
      public_key: wif.value.toPublic().toString(),
    };
    return result;
  };

  const hashMessage = (message: string | Uint8Array) => {
    return hashSHA256(message);
  };

  async function transact(
    actionOrActions: any | any[],
    broadcast = true
  ): Promise<TransactResult | undefined> {
    if (Array.isArray(actionOrActions)) {
      return await sendActions(actionOrActions, broadcast);
    } else {
      return await sendAction(actionOrActions, broadcast);
    }
  }
  const formActionFromAbi = async (action: any) => {
    const { abi } = (await readBlockchain?.v1.chain.get_abi(action.account)) ?? {
      abi: undefined,
    };
    return Action.from(action, abi);
  };

  const sendAction = async (action: any, broadcast: boolean) => {
    const session = useSessionStore();
    const formedAction = await formActionFromAbi(action);

    return session.session?.transact({
      action: formedAction,
    }, { broadcast });
  };

  const sendActions = async (actions: any[], broadcast: boolean) => {
    const session = useSessionStore();
    const data: Action[] = [];

    for (const action of actions) {
      const formedAction = await formActionFromAbi(action);
      data.push(formedAction);
    }

    return session.session?.transact({
      actions: data,
    }, { broadcast });
  };

  return {
    init,
    username,
    wif,
    hasCreditials,
    tokens,
    setWif,
    setTokens,
    logout,
    signDigest,
    hashMessage,
    transact,
    formActionFromAbi
  };
});
