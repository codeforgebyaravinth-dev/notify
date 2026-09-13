import { IntegrationRepository } from '@notify/dal';
import { ChannelTypeEnum } from '@notify/stateless';

export async function updateFcmCredentials() {
  console.log('start migration - update fcm credentials (user to serviceAccount)');

  const integrationRepository = new IntegrationRepository();

  console.log('rename all credentials.user credentials.serviceAccount - channel push, provider fcm');

  await integrationRepository.update(
    {
      provider: 'fcm',
      channel: ChannelTypeEnum.PUSH,
      'credentials.user': { $exists: true },
    },
    { $rename: { 'credentials.user': 'credentials.serviceAccount' } }
  );

  console.log('end migration');
}
