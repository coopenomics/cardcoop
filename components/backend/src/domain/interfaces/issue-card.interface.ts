export interface IssueCardDomainInterface{
    userId: string;  
    username: string;
    encrypted_key: string;
    encrypted_data: string;
    meta: {
      version: number;
    }
}