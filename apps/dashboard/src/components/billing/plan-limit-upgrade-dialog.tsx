import { Cross2Icon } from '@radix-ui/react-icons';
import type { ReactNode } from 'react';
import {
  RiArrowRightLine,
  RiCheckLine,
  RiCustomerService2Line,
  RiFlashlightLine,
  RiLockLine,
} from 'react-icons/ri';
import { UPGRADE_CTA_LABEL, usePlanUpgradeClick } from '@/components/billing/use-plan-upgrade-click';
import { Button } from '@/components/primitives/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from '@/components/primitives/dialog';
import { SUPPORT_EMAIL } from '@/config';
import { usePlainChat } from '@/hooks/use-plain-chat';

export type PlanLimitUpgradeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  /** Rendered as a secondary "continue past the warning" button when provided. */
  continueLabel?: string;
  onContinueAnyway?: () => void;
  /**
   * `upgrade` renders the plan-upgrade CTA; `contact-support` opens live chat
   * (or support email) for limits that upgrading cannot lift.
   */
  primaryCta: 'upgrade' | 'contact-support';
  telemetrySource: string;
  utmCampaign: string;
};

/** Key benefits to show on the upgrade dialog — keeps it aspirational */
const UPGRADE_BENEFITS = [
  'Remove all feature limits',
  'Priority support & faster responses',
  'Advanced team collaboration',
];

/**
 * Generic billing primitive behind every plan-limit dialog (agents, channels,
 * domains, …). Feature wrappers own the copy; this owns the layout, the
 * upgrade/contact-support CTAs, and the upgrade-click flow.
 */
export function PlanLimitUpgradeDialog({
  open,
  onOpenChange,
  title,
  description,
  continueLabel,
  onContinueAnyway,
  primaryCta,
  telemetrySource,
  utmCampaign,
}: PlanLimitUpgradeDialogProps) {
  const planUpgradeClick = usePlanUpgradeClick(telemetrySource, utmCampaign);
  const { isLiveChatVisible, showPlainLiveChat } = usePlainChat();

  const handleUpgradeClick = () => {
    onOpenChange(false);
    planUpgradeClick();
  };

  const handleContactSupportClick = () => {
    onOpenChange(false);

    if (isLiveChatVisible) {
      showPlainLiveChat();
      return;
    }

    window.location.href = `mailto:${SUPPORT_EMAIL}`;
  };

  const handleContinueAnyway = () => {
    onOpenChange(false);
    onContinueAnyway?.();
  };

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="max-w-[420px] overflow-hidden rounded-xl! border-0 p-0 shadow-2xl" hideCloseButton>
          {/* Gradient top bar */}
          <div
            className="h-1 w-full"
            style={{ background: 'linear-gradient(90deg, #8444df 0%, #fb3748 50%, #ff884d 100%)' }}
          />

          <div className="p-5">
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                {primaryCta === 'upgrade' ? (
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: 'linear-gradient(135deg, #8444df20 0%, #fb374815 100%)',
                      border: '1px solid #8444df30',
                    }}
                  >
                    <RiLockLine className="h-4.5 w-4.5" style={{ color: '#8444df' }} />
                  </div>
                ) : (
                  <div className="bg-bg-weak flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200">
                    <RiCustomerService2Line className="text-text-soft h-4.5 w-4.5" />
                  </div>
                )}

                <div>
                  {primaryCta === 'upgrade' && (
                    <span
                      className="mb-0.5 block rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest"
                      style={{
                        background: 'linear-gradient(135deg, #8444df12, #fb374808)',
                        border: '1px solid #8444df20',
                        color: '#8444df',
                        display: 'inline-block',
                      }}
                    >
                      Plan limit reached
                    </span>
                  )}
                  <h3 className="text-foreground-900 text-sm font-semibold leading-tight">{title}</h3>
                </div>
              </div>

              <DialogClose className="text-text-soft hover:text-foreground-900 -mr-1 -mt-1 rounded p-1 transition-colors">
                <Cross2Icon className="size-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </div>

            {/* Description */}
            <p className="text-text-sub mb-4 text-[13px] leading-relaxed">{description}</p>

            {/* Benefits list — only for upgrade CTA */}
            {primaryCta === 'upgrade' && (
              <ul className="mb-5 space-y-1.5">
                {UPGRADE_BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-[12px] text-neutral-600">
                    <div
                      className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                      style={{ background: '#8444df15', border: '1px solid #8444df25' }}
                    >
                      <RiCheckLine className="h-2.5 w-2.5" style={{ color: '#8444df' }} />
                    </div>
                    {benefit}
                  </li>
                ))}
              </ul>
            )}

            {/* Footer actions */}
            <div className="flex items-center gap-2">
              {continueLabel && onContinueAnyway && (
                <Button
                  type="button"
                  size="sm"
                  mode="outline"
                  variant="secondary"
                  className="flex-1"
                  onClick={handleContinueAnyway}
                >
                  {continueLabel}
                </Button>
              )}

              {primaryCta === 'upgrade' ? (
                <button
                  type="button"
                  onClick={handleUpgradeClick}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #8444df 0%, #6b35b8 100%)',
                    boxShadow: '0 2px 8px #8444df35',
                  }}
                >
                  <RiFlashlightLine className="h-4 w-4" />
                  {UPGRADE_CTA_LABEL}
                  <RiArrowRightLine className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  className="flex-1"
                  leadingIcon={RiCustomerService2Line}
                  onClick={handleContactSupportClick}
                >
                  Contact support
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
