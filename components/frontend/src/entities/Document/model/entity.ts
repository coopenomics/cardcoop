import type { IGenerate, IGeneratedDocument } from './types'
import { api } from '../api'
import { useGlobalStore } from 'src/shared/store';
import type { IObjectedDocument } from 'src/shared/lib/types/document';
import type { Cooperative } from 'cooptypes';

export class DigitalDocument {
  public data: IGeneratedDocument | undefined
  public signedDocument: IObjectedDocument | undefined

  constructor(document?: IGeneratedDocument){
    this.data = document
  }

  async generate<T extends IGenerate>(data: T, options?: Cooperative.Document.IGenerationOptions): Promise<IGeneratedDocument> {
    this.data = await api.generateDocument(data, options);
    return this.data;
  }n

  async sign(): Promise<void> {
    const globalStore = useGlobalStore()
    if (!this.data)
      throw new Error('Ошибка генерации документа')

    const digital_signature = await globalStore.signDigest(this.data.hash);

    this.signedDocument = {
      hash: this.data.hash,
      meta: this.data.meta,
      public_key: digital_signature.public_key,
      signature: digital_signature.signature,
    };

  }

}
