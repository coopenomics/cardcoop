import type { Cooperative } from 'cooptypes';
import type { IGenerate, IGeneratedDocument } from '../model';

import { sendPOST } from 'src/shared/api';

async function generateDocument(data: IGenerate, options?: Cooperative.Document.IGenerationOptions): Promise<IGeneratedDocument> {
  // return await sendPOST(`/v1/documents/${data.username}/generate`, data);
  return await sendPOST('/v1/documents/generate', {data, options});
}

export const api = {
  generateDocument,
};
