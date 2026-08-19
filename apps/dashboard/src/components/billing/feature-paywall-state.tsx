/**
 * FeaturePaywallState — shared layout for full-page feature paywalls.
 *
 * Usage:
 *   <FeaturePaywallState
 *     icon={RiWebhookLine}
 *     title="Webhooks"
 *     description="..."
 *     tierLabel="Pro"
 *     benefits={[...]}
 *     onUpgrade={() => navigate(ROUTES.SETTINGS_BILLING)}
 *     upgradeLabel="Upgrade to Pro"
 *   />
 */

import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { RiArrowRightLine, RiFlashlightLine, RiShieldKeyholeLine } from 'react-icons/ri';

interface FeaturePaywallStateProps {
  /** React icon component to display */
  icon: IconType;
  title: string;
  description: string;
  /** e.g. "Pro" — the plan name needed to unlock, or null for a generic prompt */
  tierLabel?: string | null;
  /** bullet points describing what the feature unlocks */
  benefits: string[];
  upgradeLabel: string;
  onUpgrade: () => void;
  /** Optional children rendered below the upgrade button (e.g. a docs link) */
  children?: ReactNode;
}

export function FeaturePaywallState({
  icon: Icon,
  title,
  description,
  tierLabel,
  benefits,
  upgradeLabel,
  onUpgrade,
  children,
}: FeaturePaywallStateProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-[480px]">
        {/* Icon with lock badge */}
        <div className="mb-6 flex justify-center">
          <div
            className="relative flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #8444df18 0%, #fb374812 100%)',
              border: '1px solid #8444df30',
              boxShadow: '0 0 32px #8444df18',
            }}
          >
            <Icon className="h-7 w-7" style={{ color: '#8444df' }} />
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
            <h2 className="text-foreground-900 text-xl font-semibold">{title}</h2>
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
          <p className="text-text-soft mx-auto max-w-[340px] text-sm leading-relaxed">{description}</p>
        </div>

        {/* Benefits */}
        {benefits.length > 0 && (
          <div
            className="mb-6 rounded-xl p-4"
            style={{
              background: 'linear-gradient(135deg, #8444df08 0%, #fb374805 100%)',
              border: '1px solid #8444df18',
            }}
          >
            <ul className="space-y-2.5">
              {benefits.map((benefit) => (
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
        )}

        {/* Upgrade prompt */}
        <div className="text-center">
          {tierLabel && (
            <p className="text-text-soft mb-4 text-xs">
              {title} requires the{' '}
              <span className="font-medium" style={{ color: '#8444df' }}>
                {tierLabel}
              </span>{' '}
              plan or above.
            </p>
          )}

          <button
            type="button"
            onClick={onUpgrade}
            className="group mx-auto flex items-center gap-2.5 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #8444df 0%, #6b35b8 100%)',
              boxShadow: '0 2px 12px #8444df35',
            }}
          >
            <RiFlashlightLine className="h-4 w-4" />
            {upgradeLabel}
            <RiArrowRightLine className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          {children && <div className="mt-3">{children}</div>}
        </div>
      </div>
    </div>
  );
}
