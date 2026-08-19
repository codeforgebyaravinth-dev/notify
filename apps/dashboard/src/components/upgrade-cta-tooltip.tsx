import { ApiServiceLevelEnum } from '@novu/shared';
import { ReactNode } from 'react';
import { RiArrowRightLine, RiFlashlightLine, RiLockLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/primitives/tooltip';
import { IS_SELF_HOSTED, SELF_HOSTED_UPGRADE_REDIRECT_URL } from '@/config';
import { ROUTES } from '@/utils/routes';
import { getPlanLabel } from '@/utils/upgrade-tier';
import { openInNewTab } from '@/utils/url';

type UpgradeCTATooltipProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  /**
   * Lowest tier that unlocks the gated feature. When set (on cloud), the copy
   * and CTA name the exact plan the user needs (e.g. "Upgrade to Pro") instead
   * of a generic upgrade prompt. Ignored on self-hosted.
   */
  requiredTier?: ApiServiceLevelEnum | null;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  utmCampaign?: string;
  utmSource?: string;
};

export function UpgradeCTATooltip({
  children,
  description,
  requiredTier,
  side = 'bottom',
  align = 'end',
  sideOffset = 6,
  utmCampaign = 'upgrade_prompt',
  utmSource = 'upgrade_prompt',
}: UpgradeCTATooltipProps) {
  const navigate = useNavigate();

  const tierLabel = requiredTier && !IS_SELF_HOSTED ? getPlanLabel(requiredTier) : null;

  let defaultDescription: string;
  if (IS_SELF_HOSTED) {
    defaultDescription = 'Unlock this feature by upgrading to Cloud plans';
  } else if (tierLabel) {
    defaultDescription = `Available on the ${tierLabel} plan and above`;
  } else {
    defaultDescription = 'Unlock this feature by upgrading your plan';
  }

  const ctaLabel = tierLabel ? `Upgrade to ${tierLabel}` : 'Upgrade plan';
  const finalDescription = description || defaultDescription;

  const handleUpgradeClick = () => {
    if (IS_SELF_HOSTED) {
      openInNewTab(`${SELF_HOSTED_UPGRADE_REDIRECT_URL}?utm_campaign=${utmCampaign}`);
    } else {
      navigate(`${ROUTES.SETTINGS_BILLING}?utm_source=${utmSource}`);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        variant="light"
        size="lg"
        className="w-72 overflow-hidden rounded-lg border border-neutral-200 p-0 shadow-xl"
      >
        {/* Top accent bar */}
        <div
          className="h-0.5 w-full"
          style={{ background: 'linear-gradient(90deg, #8444df 0%, #fb3748 50%, #ff884d 100%)' }}
        />

        <div className="p-3">
          {/* Header row */}
          <div className="mb-2.5 flex items-center gap-2">
            <div
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
              style={{ background: 'linear-gradient(135deg, #8444df20 0%, #fb374815 100%)', border: '1px solid #8444df30' }}
            >
              <RiLockLine className="h-3.5 w-3.5" style={{ color: '#8444df' }} />
            </div>
            <div className="flex items-center gap-1.5">
              {/* Gradient badge */}
              <span
                className="rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest"
                style={{
                  background: 'linear-gradient(135deg, #8444df15, #fb374810)',
                  border: '1px solid #8444df25',
                  color: '#8444df',
                }}
              >
                {tierLabel ? `${tierLabel} feature` : 'Paid feature'}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="mb-3 text-[12px] leading-relaxed text-neutral-600">{finalDescription}</p>

          {/* CTA button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleUpgradeClick();
            }}
            className="group flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #8444df 0%, #6b35b8 100%)',
              boxShadow: '0 1px 4px #8444df40',
            }}
          >
            <span className="flex items-center gap-1.5">
              <RiFlashlightLine className="h-3.5 w-3.5" />
              {ctaLabel}
            </span>
            <RiArrowRightLine className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
