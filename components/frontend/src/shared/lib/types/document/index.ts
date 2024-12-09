import type { Cooperative } from 'cooptypes';

export interface IObjectedDocument {
  hash: string;
  meta: Cooperative.Document.IMetaDocument;
  public_key: string;
  signature: string;
}

export interface IDocument {
  hash: string;
  meta: string;
  public_key: string;
  signature: string;
}
