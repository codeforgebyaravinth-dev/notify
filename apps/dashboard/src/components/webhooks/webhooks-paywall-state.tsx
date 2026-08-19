import { FeatureNameEnum } from '@novu/shared';
import { RiArrowRightLine, RiFlashlightLine, RiShieldKeyholeLine, RiWebhookLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/utils/routes';
import { getMinimumTierForFeature, getPlanLabel, getUpgradeButtonLabel } from '@/utils/upgrade-tier';
import { openInNewTab } from '@/utils/url';
import { IS_SELF_HOSTED, SELF_HOSTED_UPGRADE_REDIRECT_URL } from '../../config';
import { useTelemetry } from '../../hooks/use-telemetry';
import { TelemetryEvent } from '../../utils/telemetry';

export { EmptyStateSvg } from './webhooks-empty-state-svg';

const WEBHOOK_BENEFITS = [
  'Get notified when messages are delivered, failed, or bounced',
  'React to workflow status changes in real-time',
  'Build custom integrations and automation on top of Notify events',
];

export function WebhooksPaywallState() {
  const track = useTelemetry();
  const navigate = useNavigate();

  const requiredTier = getMinimumTierForFeature(FeatureNameEnum.WEBHOOKS);
  const tierLabel = !IS_SELF_HOSTED && requiredTier ? getPlanLabel(requiredTier) : null;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-[480px]">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div
            className="relative flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #8444df18 0%, #fb374812 100%)',
              border: '1px solid #8444df30',
              boxShadow: '0 0 32px #8444df18',
            }}
          >
            <RiWebhookLine className="h-7 w-7" style={{ color: '#8444df' }} />
            {/* Lock badge */}
            <div
              className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full"
              style={{
                background: 'linear-gradient(135deg, #8444df, #6b35b8)',
                boxShadow: '0 2px 6px #8444df50',
              }}
            >
              <RiShieldKeyholeLine className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
        </div>

        {/* Title & description */}
        <div className="mb-5 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <h2 className="text-foreground-900 text-xl font-semibold">Webhooks</h2>
            {tierLabel && (
              <span
                className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  background: 'linear-gradient(135deg, #8444df14, #fb374810)',
                  border: '1px solid #8444df25',
                  color: '#8444df',
                }}
              >
                {tierLabel}+
              </span>
            )}
          </div>
          <p className="text-text-soft mx-auto max-w-[320px] text-sm leading-relaxed">
            Get real-time event notifications from your Notify instance — message deliveries, workflow updates, and
            subscriber changes.
          </p>
        </div>

        {/* Benefits */}
        <div
          className="mb-6 rounded-xl p-4"
          style={{
            background: 'linear-gradient(135deg, #8444df08 0%, #fb374805 100%)',
            border: '1px solid #8444df18',
          }}
        >
          <ul className="space-y-2.5">
            {WEBHOOK_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2.5 text-[12.5px] text-neutral-600">
                <div
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                  style={{ background: '#8444df18', border: '1px solid #8444df28' }}
                >
                  <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#8444df' }} />
                </div>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Upgrade prompt */}
        <div className="text-center">
          {tierLabel && (
            <p className="text-text-soft mb-4 text-xs">
              Webhooks require the{' '}
              <span className="font-medium" style={{ color: '#8444df' }}>
                {tierLabel}
              </span>{' '}
              plan or above.
            </p>
          )}

          <button
            type="button"
            onClick={() => {
              track(TelemetryEvent.UPGRADE_TO_TEAM_TIER_CLICK, {
                source: 'webhooks-page',
              });

              if (IS_SELF_HOSTED) {
                openInNewTab(SELF_HOSTED_UPGRADE_REDIRECT_URL + '?utm_campaign=webhooks');
              } else {
                navigate(ROUTES.SETTINGS_BILLING);
              }
            }}
            className="group mx-auto flex items-center gap-2.5 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #8444df 0%, #6b35b8 100%)',
              boxShadow: '0 2px 12px #8444df35',
            }}
          >
            <RiFlashlightLine className="h-4 w-4" />
            {getUpgradeButtonLabel(requiredTier)}
            <RiArrowRightLine className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
