import { Cooperative } from 'cooptypes';

export type IEntrepreneurData = Cooperative.Users.IEntrepreneurData;
export type IIndividualData = Cooperative.Users.IIndividualData;
export type IOrganizationData = Cooperative.Users.IOrganizationData;

export interface IUserData {
  type: 'individual' | 'entrepreneur' | 'organization';
  entrepreneur_data?: IEntrepreneurData & {bank_account: Cooperative.Payments.IBankAccount};
  individual_data?: IIndividualData;
  organization_data?: IOrganizationData & {bank_account: Cooperative.Payments.IBankAccount};
}


type OmitUsername<T> = Omit<T, 'username'>;

export type ICreateEntrepreneurData = OmitUsername<Cooperative.Users.IEntrepreneurData>;
export type ICreateIndividualData = OmitUsername<Cooperative.Users.IIndividualData>;
export type ICreateOrganizationData = OmitUsername<Cooperative.Users.IOrganizationData>;

export interface ICreateUserData {
  type: 'individual' | 'entrepreneur' | 'organization';
  entrepreneur_data?: ICreateEntrepreneurData & {bank_account: Cooperative.Payments.IBankAccount};
  individual_data?: ICreateIndividualData;
  organization_data?: ICreateOrganizationData & {bank_account: Cooperative.Payments.IBankAccount};
}
