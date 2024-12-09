import { TransactResult } from '@wharfkit/session';
import { Cooperative, RegistratorContract } from 'cooptypes';
import { useSessionStore } from 'src/entities/Session';
import { useGlobalStore } from 'src/shared/store';

export function useUpdateMeta() {
  async function updateMeta(
    account_to_change: string,
    meta: Cooperative.Users.IAccountMeta
  ): Promise<TransactResult | undefined> {
    const session = useSessionStore();

    const data: RegistratorContract.Actions.UpdateAccount.IUpdateAccount = {
      username: session.username,
      account_to_change,
      meta: JSON.stringify(meta)
    }

    const result = useGlobalStore().transact({
      account: RegistratorContract.contractName.production,
      name: RegistratorContract.Actions.UpdateAccount.actionName,
      authorization: [
        {
          actor: session.username,
          permission: 'active',
        },
      ],
      data,
    });

    return result;
  }
  return { updateMeta };
}
