import { IObjectedDocument } from '../document';
import { Cooperative } from 'cooptypes';

export interface IKeyPair {
  private_key: string;
  public_key: string;
}

export interface IGeneratedAccount extends IKeyPair {
  username: string;
}

export interface IToken {
  token: string;
  expires: Date;
}

export interface ITokens {
  access: IToken;
  refresh: IToken;
}

export interface IWifPair {
  username: string;
  wif: string;
}

export interface IUser {
  username: string;
  email: string;
  private_data:
    | Cooperative.Users.IEntrepreneurData
    | Cooperative.Users.IIndividualData
    | Cooperative.Users.IOrganizationData;
  public_key: string;
  referer?: string;
  role: 'user' | 'admin';
  type: 'individual' | 'entrepreneur' | 'organization';
}

export interface ICreatedUser {
  user: IUser;
  tokens: ITokens;
}

export interface ISendStatement {
  username: string;
  statement: IObjectedDocument;
  wallet_agreement: IObjectedDocument;
  privacy_agreement: IObjectedDocument;
  signature_agreement: IObjectedDocument;
  user_agreement: IObjectedDocument;
}
