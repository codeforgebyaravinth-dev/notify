import { generateObjectId } from '@notify/application-generic';

export function generateTransactionId() {
  return `txn_${generateObjectId()}`;
}
