import { ApiServiceLevelEnum, FeatureNameEnum, getFeatureForTierAsBoolean, ResourceOriginEnum } from '@novu/shared';
import { HTMLAttributes } from 'react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/primitives/separator';
import { Switch } from '@/components/primitives/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/primitives/tooltip';
import { UpgradeCTATooltip } from '@/components/upgrade-cta-tooltip';
import { useFetchOrganizationSettings } from '@/hooks/use-fetch-organization-settings';
import { useFetchSubscription } from '@/hooks/use-fetch-subscription';
import { useUpdateOrganizationSettings } from '@/hooks/use-update-organization-settings';
import { ROUTES } from '@/utils/routes';
import { cn } from '@/utils/ui';
import { getMinimumTierForFeature } from '@/utils/upgrade-tier';

type NovuBrandingProps = HTMLAttributes<HTMLDivElement> & {
  resourceOrigin: ResourceOriginEnum;
  isStepResolver?: boolean;
};

export const NovuBranding = ({ className, resourceOrigin, isStepResolver, ...rest }: NovuBrandingProps) => {
  const { subscription } = useFetchSubscription();
  const navigate = useNavigate();
  const { data: organizationSettings, isLoading: isLoadingSettings } = useFetchOrganizationSettings();
  const updateOrganizationSettings = useUpdateOrganizationSettings();

  const canRemoveNovuBranding = getFeatureForTierAsBoolean(
    FeatureNameEnum.PLATFORM_REMOVE_NOVU_BRANDING_BOOLEAN,
    subscription?.apiServiceLevel || ApiServiceLevelEnum.FREE
  );

  const removeNovuBranding = organizationSettings?.data?.removeNovuBranding;
  const isUpdating = updateOrganizationSettings.isPending;

  const showBranding = true;

  if (!showBranding) return null;

  const handleRemoveBrandingChange = (value: boolean) => {
    updateOrganizationSettings.mutate({
      removeNovuBranding: value,
    });
  };

  const handleOrganizationSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(ROUTES.SETTINGS_ORGANIZATION);
  };

  const brandingContent = (
    <div className="flex items-center justify-center text-xs text-neutral-400 font-sans">
      Powered by <strong style={{ color: '#7c3aed', marginLeft: '4px' }}>Notify</strong>
    </div>
  );

  return (
    <div className={cn('flex items-center justify-center pb-6 pt-4', className)} {...rest}>
      {brandingContent}
    </div>
  );
};
