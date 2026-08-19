import {
  ApiServiceLevelEnum,
  ChannelTypeEnum,
  EmailProviderIdEnum,
  SmsProviderIdEnum,
  PushProviderIdEnum,
} from '@novu/shared';
import { useMemo } from 'react';
import { RiFlashlightLine, RiLockUnlockLine, RiCheckboxCircleFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/primitives/button';
import { StatusBadge, StatusBadgeIcon } from '@/components/primitives/status-badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/primitives/tooltip';
import { useCreateIntegration } from '@/hooks/use-create-integration';
import { useFetchIntegrations } from '@/hooks/use-fetch-integrations';
import { useFetchSubscription } from '@/hooks/use-fetch-subscription';
import { useSetPrimaryIntegration } from '@/hooks/use-set-primary-integration';
import { useEnvironment } from '@/context/environment/hooks';
import { ProviderIcon } from './provider-icon';

const MANAGED_PROVIDERS = [
  {
    id: EmailProviderIdEnum.Notify,
    channel: ChannelTypeEnum.EMAIL,
    name: '1-Click Email (Notify Managed)',
  },
  {
    id: SmsProviderIdEnum.Notify,
    channel: ChannelTypeEnum.SMS,
    name: '1-Click SMS (Notify Managed)',
  },
  {
    id: PushProviderIdEnum.Notify,
    channel: ChannelTypeEnum.PUSH,
    name: '1-Click Push (Notify Managed)',
  },
];

export function ManagedIntegrationsSection() {
  const { subscription } = useFetchSubscription();
  const { integrations } = useFetchIntegrations();
  const { mutateAsync: createIntegration, isPending: isCreating } = useCreateIntegration();
  const { mutateAsync: setPrimaryIntegration, isPending: isSettingPrimary } = useSetPrimaryIntegration();
  const { currentEnvironment } = useEnvironment();
  const navigate = useNavigate();

  const isFreePlan = subscription?.apiServiceLevel === ApiServiceLevelEnum.FREE;

  const handleActivate = async (providerId: string, channel: ChannelTypeEnum, providerName: string) => {
    if (isFreePlan) {
      navigate('/settings/billing');
      return;
    }
    
    if (!currentEnvironment) return;

    try {
      const integration = await createIntegration({
        providerId,
        channel,
        credentials: {},
        name: providerName,
        active: true,
        _environmentId: currentEnvironment._id,
      });

      if (integration?.data?._id) {
        await setPrimaryIntegration({ integrationId: integration.data._id });
      }
    } catch (e) {
      console.error('Failed to activate integration:', e);
    }
  };

  const isPending = isCreating || isSettingPrimary;

  if (!integrations) return null;

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-2">
        <RiFlashlightLine className="text-primary size-5" />
        <h2 className="text-md text-foreground-950 font-medium">1-Click Managed Integrations</h2>
      </div>
      <p className="text-foreground-600 text-sm">
        Activate our fully managed, zero-setup providers instantly. Start sending notifications without managing any API keys.
      </p>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MANAGED_PROVIDERS.map((provider) => {
          const existingIntegration = integrations.find(
            (i) => i.providerId === provider.id && i.channel === provider.channel && i._environmentId === currentEnvironment?._id
          );
          
          const isActive = !!existingIntegration?.active;

          return (
            <div
              key={provider.id}
              className="bg-card shadow-xs relative flex min-h-[125px] flex-col gap-2 overflow-hidden rounded-none border border-neutral-200 p-3 transition-all"
            >
              <div className="flex justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="relative h-6 w-6">
                    <ProviderIcon
                      providerId={provider.id}
                      providerDisplayName={provider.name}
                      className="h-full w-full"
                    />
                  </div>
                  <span className="text-sm font-medium">{provider.name}</span>
                </div>
              </div>
              
              <div className="mt-auto flex items-center justify-between">
                {isActive ? (
                  <StatusBadge variant="light" status="completed">
                    <StatusBadgeIcon as={RiCheckboxCircleFill} />
                    Active (Primary)
                  </StatusBadge>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          size="xs"
                          variant="primary"
                          mode="filled"
                          className="rounded-none h-[26px]"
                          disabled={isPending}
                          onClick={() => handleActivate(provider.id, provider.channel, provider.name)}
                          leadingIcon={isFreePlan ? RiLockUnlockLine : undefined}
                        >
                          {isFreePlan ? 'Upgrade to Activate' : 'Activate 1-Click'}
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {isFreePlan && (
                      <TooltipContent>
                        Requires Pro or Business tier to activate managed integrations.
                      </TooltipContent>
                    )}
                  </Tooltip>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
