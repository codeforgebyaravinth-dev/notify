import { ApiServiceLevelEnum, PermissionsEnum, StripeBillingIntervalEnum } from '@novu/shared';
import { motion } from 'motion/react';
import { useState } from 'react';
import {
  RiArrowRightLine,
  RiCalendarEventLine,
  RiChat3Line,
  RiCheckLine,
  RiCloseLine,
  RiLoader4Line,
  RiShieldCheckLine,
  RiTeamLine,
} from 'react-icons/ri';
import { useBillingPortal } from '../../hooks/use-billing-portal';
import { useCheckoutSession } from '../../hooks/use-checkout-session';
import { useFetchConversationUsage } from '../../hooks/use-fetch-conversation-usage';
import { useFetchSubscription } from '../../hooks/use-fetch-subscription';
import { useHasPermission } from '../../hooks/use-has-permission';
import { cn } from '../../utils/ui';

/* ─── Types ───────────────────────────────────────────────── */

type BillingInterval = 'month' | 'year';
type PlanKey = 'free' | 'pro' | 'business' | 'enterprise';

interface PlanDef {
  key: PlanKey;
  name: string;
  subtitle: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  highlights: string[];
  badge?: string;
  serviceLevel: ApiServiceLevelEnum;
}

interface FeatureRow {
  label: string;
  free: string | boolean;
  pro: string | boolean;
  business: string | boolean;
  enterprise: string | boolean;
}

interface FeatureSection {
  title: string;
  rows: FeatureRow[];
}

/* ─── Plan Definitions ────────────────────────────────────── */

const PLANS: PlanDef[] = [
  {
    key: 'free',
    name: 'Free',
    subtitle: 'Forever free — no strings attached',
    monthlyPrice: 0,
    yearlyPrice: 0,
    highlights: ['10,000 workflow runs/mo', '50 active conversations', '1 day activity feed'],
    serviceLevel: ApiServiceLevelEnum.FREE,
  },
  {
    key: 'pro',
    name: 'Pro',
    subtitle: 'For growing teams',
    monthlyPrice: 29,
    yearlyPrice: 23,
    highlights: ['30,000 workflow runs/mo', '500 active conversations', '30 days activity feed'],
    badge: 'RECOMMENDED',
    serviceLevel: ApiServiceLevelEnum.PRO,
  },
  {
    key: 'business',
    name: 'Business',
    subtitle: 'For scaling teams',
    monthlyPrice: 99,
    yearlyPrice: 79,
    highlights: ['250,000 workflow runs/mo', '2,000 active conversations', '90 days activity feed'],
    serviceLevel: ApiServiceLevelEnum.BUSINESS,
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    subtitle: 'For large organizations',
    monthlyPrice: null,
    yearlyPrice: null,
    highlights: ['Custom workflow runs', 'Unlimited conversations', 'Custom retention'],
    serviceLevel: ApiServiceLevelEnum.ENTERPRISE,
  },
];

/* ─── Feature Table ───────────────────────────────────────── */

const FEATURE_SECTIONS: FeatureSection[] = [
  {
    title: 'Workflow Runs',
    rows: [
      { label: 'Included runs / month', free: '10,000', pro: '30,000', business: '250,000', enterprise: 'Custom' },
      { label: 'Cost per extra 1K runs', free: '— (hard limit)', pro: '$1.00', business: '$0.80', enterprise: 'Custom' },
      { label: 'Overage allowed', free: false, pro: true, business: true, enterprise: true },
      { label: 'All channels (email, SMS, push, in-app, chat)', free: true, pro: true, business: true, enterprise: true },
    ],
  },
  {
    title: '1-Click Provider Integrations (Add-on)',
    rows: [
      { label: 'Bring Your Own Credentials (BYOC)', free: true, pro: true, business: true, enterprise: true },
      { label: '1-Click Email (Notify Managed)', free: false, pro: '$1.00 / 1K emails', business: '$0.80 / 1K emails', enterprise: 'Custom' },
      { label: '1-Click SMS (Notify Managed)', free: false, pro: '$0.02 / SMS', business: '$0.015 / SMS', enterprise: 'Custom' },
      { label: '1-Click Push (Notify Managed)', free: false, pro: '$0.50 / 1K pushes', business: '$0.40 / 1K pushes', enterprise: 'Custom' },
    ],
  },
  {
    title: 'Platform',
    rows: [
      { label: 'Subscribers', free: 'Unlimited', pro: 'Unlimited', business: 'Unlimited', enterprise: 'Unlimited' },
      { label: 'Max workflows', free: '5', pro: 'Unlimited', business: 'Unlimited', enterprise: 'Unlimited' },
      { label: 'Max email layouts', free: '1', pro: '10', business: 'Unlimited', enterprise: 'Unlimited' },
      { label: 'Custom environments', free: false, pro: false, business: true, enterprise: true },
      { label: 'Auto-translations', free: false, pro: false, business: true, enterprise: true },
      { label: 'Webhooks', free: false, pro: true, business: true, enterprise: true },
      { label: 'Environment variables (secrets)', free: false, pro: true, business: true, enterprise: true },
    ],
  },
  {
    title: 'Agents',
    rows: [
      { label: 'Max active conversations / month', free: '50', pro: '500', business: '2,000', enterprise: 'Unlimited' },
      { label: 'Cost per extra conversation', free: '—', pro: '$0.05', business: '$0.04', enterprise: 'Custom' },
      { label: 'Max agents', free: '1', pro: '5', business: '20', enterprise: 'Unlimited' },
      { label: 'Max active channels per agent', free: '1', pro: '3', business: 'Unlimited', enterprise: 'Unlimited' },
      { label: 'Remove Notify branding', free: false, pro: true, business: true, enterprise: true },
      { label: 'Custom email domains', free: false, pro: '1', business: '5', enterprise: 'Unlimited' },
    ],
  },
  {
    title: 'Retention',
    rows: [
      { label: 'Activity feed retention', free: '1 day', pro: '30 days', business: '90 days', enterprise: 'Custom' },
      { label: 'Max delay duration', free: '1 hour', pro: '24 hours', business: '30 days', enterprise: 'Custom' },
      { label: 'Max digest window', free: '1 hour', pro: '24 hours', business: '30 days', enterprise: 'Custom' },
    ],
  },
  {
    title: 'Inbox',
    rows: [
      { label: 'Inbox component', free: true, pro: true, business: true, enterprise: true },
      { label: 'User preference component', free: false, pro: true, business: true, enterprise: true },
      { label: 'Remove branding in inbox', free: false, pro: true, business: true, enterprise: true },
      { label: 'Max snooze duration', free: '1 hour', pro: '24 hours', business: '30 days', enterprise: 'Custom' },
    ],
  },
  {
    title: 'Team & Administration',
    rows: [
      { label: 'Max team members', free: '3', pro: '10', business: '50', enterprise: 'Unlimited' },
      { label: 'Role-based access control (RBAC)', free: false, pro: false, business: true, enterprise: true },
      { label: 'SAML SSO / OIDC', free: false, pro: false, business: false, enterprise: true },
      { label: 'Audit logs', free: false, pro: false, business: true, enterprise: true },
    ],
  },
  {
    title: 'Support',
    rows: [
      { label: 'Support channel', free: 'Community', pro: 'Email', business: 'Priority email', enterprise: 'Dedicated Slack' },
      { label: 'Support SLA', free: '—', pro: '2 business days', business: '1 business day', enterprise: '4 hours' },
      { label: 'Onboarding assistance', free: false, pro: false, business: true, enterprise: true },
    ],
  },
  {
    title: 'Legal & Compliance',
    rows: [
      { label: 'GDPR compliant', free: true, pro: true, business: true, enterprise: true },
      { label: 'Payment method', free: 'Credit card', pro: 'Credit card', business: 'Credit card', enterprise: 'Invoice / PO' },
      { label: 'HIPAA BAA', free: false, pro: false, business: false, enterprise: true },
      { label: 'Data Processing Agreements', free: false, pro: false, business: true, enterprise: true },
      { label: 'Custom security reviews', free: false, pro: false, business: false, enterprise: true },
    ],
  },
];

/* ─── Sub-components ──────────────────────────────────────── */

function FeatureValue({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <RiCheckLine className="size-4 text-purple-400 mx-auto" />
    ) : (
      <RiCloseLine className="size-4 text-zinc-700 mx-auto" />
    );
  }
  return <span className="text-xs text-zinc-300">{value}</span>;
}

function UsageMeter({
  label,
  icon: Icon,
  used,
  total,
  unlimited,
}: {
  label: string;
  icon: React.ElementType;
  used: number;
  total: number;
  unlimited?: boolean;
}) {
  const pct = unlimited ? 0 : Math.min((used / total) * 100, 100);
  const isWarning = !unlimited && pct >= 80;
  const isOver = !unlimited && pct >= 100;

  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Icon className="size-3.5" />
          <span>{label}</span>
        </div>
        <span className="text-xs font-medium text-zinc-100">
          {unlimited ? '∞' : `${used.toLocaleString()} / ${total.toLocaleString()}`}
        </span>
      </div>
      {!unlimited && (
        <div className="h-1 w-full bg-zinc-800">
          <motion.div
            className={cn('h-full', isOver ? 'bg-red-500' : isWarning ? 'bg-amber-400' : 'bg-gradient-to-r from-purple-600 to-red-500')}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      )}
    </div>
  );
}

function PlanActionBtn({
  plan,
  interval,
  currentLevel,
  isOnTrial,
}: {
  plan: PlanDef;
  interval: BillingInterval;
  currentLevel: ApiServiceLevelEnum;
  isOnTrial?: boolean;
}) {
  const { navigateToCheckout, isLoading: isCheckingOut } = useCheckoutSession();
  const { navigateToPortal, isLoading: isPortalLoading } = useBillingPortal(interval);
  const has = useHasPermission();
  const canBill = has({ permission: PermissionsEnum.BILLING_WRITE });

  if (plan.key === 'free') return null;

  const isCurrentPlan = plan.serviceLevel === currentLevel && !isOnTrial;

  if (isCurrentPlan) {
    return (
      <button
        type="button"
        disabled={isPortalLoading || !canBill}
        onClick={() => navigateToPortal()}
        className="w-full border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors disabled:opacity-50"
      >
        {isPortalLoading ? <RiLoader4Line className="size-3.5 animate-spin mx-auto" /> : 'Manage Subscription'}
      </button>
    );
  }

  const planOrder: ApiServiceLevelEnum[] = [
    ApiServiceLevelEnum.FREE,
    ApiServiceLevelEnum.PRO,
    ApiServiceLevelEnum.BUSINESS,
    ApiServiceLevelEnum.ENTERPRISE,
  ];
  const isUpgrade = planOrder.indexOf(plan.serviceLevel) > planOrder.indexOf(currentLevel);
  const label = isUpgrade ? `Upgrade to ${plan.name}` : `Downgrade to ${plan.name}`;

  return (
    <button
      type="button"
      disabled={isCheckingOut || !canBill}
      onClick={() => navigateToCheckout({ billingInterval: interval, requestedServiceLevel: plan.serviceLevel })}
      className={cn(
        'w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all duration-300 disabled:opacity-50',
        isUpgrade
          ? 'bg-gradient-to-r from-purple-600 to-red-500 text-white hover:scale-[1.02] border border-transparent shadow-lg shadow-purple-500/20'
          : 'border border-zinc-800 text-zinc-300 hover:bg-zinc-800'
      )}
    >
      {isCheckingOut ? (
        <RiLoader4Line className="size-3.5 animate-spin" />
      ) : (
        <>
          <span>{label}</span>
          {isUpgrade && <RiArrowRightLine className="size-3.5" />}
        </>
      )}
    </button>
  );
}

/* ─── Main Component ──────────────────────────────────────── */

export function NotifyBilling() {
  const [interval, setInterval] = useState<BillingInterval>('month');
  const { subscription, isLoading } = useFetchSubscription();
  const { conversationUsage } = useFetchConversationUsage();

  const currentLevel = subscription?.apiServiceLevel || ApiServiceLevelEnum.FREE;
  const isOnTrial = subscription?.trial?.isActive;

  // Usage data
  const eventsUsed = subscription?.events?.current ?? 0;
  const eventsTotal = subscription?.events?.included ?? 10000;
  const convsUsed = conversationUsage?.current ?? 0;
  const convsTotal = 50;
  const convsUnlimited = currentLevel !== ApiServiceLevelEnum.FREE;
  const membersUsed = 1;
  const membersTotal = currentLevel === ApiServiceLevelEnum.FREE ? 3 : currentLevel === ApiServiceLevelEnum.PRO ? 10 : currentLevel === ApiServiceLevelEnum.BUSINESS ? 50 : 99999;
  const membersUnlimited = currentLevel === ApiServiceLevelEnum.ENTERPRISE;

  const currentPlanDef = PLANS.find((p) => p.serviceLevel === currentLevel) ?? PLANS[0];
  const currentPrice = interval === 'year' ? currentPlanDef.yearlyPrice : currentPlanDef.monthlyPrice;

  return (
    <div className="space-y-8 bg-zinc-950 p-6 -m-6 min-h-full">
      {/* ── Current Plan Banner ── */}
      <div className="border border-zinc-800 bg-zinc-900 shadow-xl">
        {/* Banner header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <RiShieldCheckLine className="size-4 text-zinc-400" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-100">{currentPlanDef.name} Plan</span>
                {isOnTrial && (
                  <span className="text-[10px] font-semibold tracking-widest text-amber-700 bg-amber-100 px-2 py-0.5">
                    TRIAL
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{currentPlanDef.subtitle}</p>
            </div>
          </div>
          {currentPrice !== null && (
            <div className="text-right">
              <div className="text-xl font-bold text-zinc-100">
                ${currentPrice}
                <span className="text-sm font-normal text-zinc-500">/mo</span>
              </div>
              {interval === 'year' && <p className="text-[11px] text-zinc-500">billed annually</p>}
            </div>
          )}
        </div>

        {/* Usage meters */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RiLoader4Line className="size-5 animate-spin text-zinc-600" />
          </div>
        ) : (
          <div className="flex items-stretch divide-x divide-zinc-800 px-5 py-4 gap-6">
            <UsageMeter
              label="Workflow Runs"
              icon={RiCalendarEventLine}
              used={eventsUsed}
              total={eventsTotal}
            />
            <div className="pl-6 flex-1 min-w-0">
              <UsageMeter
                label="Conversations"
                icon={RiChat3Line}
                used={convsUsed}
                total={convsTotal}
                unlimited={convsUnlimited}
              />
            </div>
            <div className="pl-6 flex-1 min-w-0">
              <UsageMeter
                label="Team Seats"
                icon={RiTeamLine}
                used={membersUsed}
                total={membersTotal}
                unlimited={membersUnlimited}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Interval Toggle ── */}
      <div className="flex items-center gap-3">
        <div className="flex border border-zinc-800 bg-zinc-900 shadow-sm p-1">
          <button
            type="button"
            onClick={() => setInterval('month')}
            className={cn(
              'px-4 py-1.5 text-xs font-medium transition-colors',
              interval === 'month' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setInterval('year')}
            className={cn(
              'px-4 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5',
              interval === 'year' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            Annual
            <span className={cn('text-[10px] font-bold px-1.5 py-0.5', interval === 'year' ? 'bg-gradient-to-r from-purple-600 to-red-500 text-white shadow-sm' : 'bg-gradient-to-r from-purple-600/20 to-red-500/20 text-purple-400')}>
              SAVE 20%
            </span>
          </button>
        </div>
      </div>

      {/* ── Plan Cards ── */}
      <div className="grid grid-cols-4 gap-4">
        {PLANS.map((plan) => {
          const price = interval === 'year' ? plan.yearlyPrice : plan.monthlyPrice;
          const isCurrentPlan = plan.serviceLevel === currentLevel && !isOnTrial;
          const isRecommended = plan.badge === 'RECOMMENDED';

          return (
            <div
              key={plan.key}
              className={cn(
                'flex flex-col gap-4 p-4 border transition-all duration-300 relative',
                isCurrentPlan ? 'border-zinc-700 bg-zinc-900 shadow-md' : isRecommended ? 'border-purple-500/50 bg-zinc-900 shadow-lg shadow-purple-500/10 scale-[1.02]' : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700'
              )}
            >
              {isRecommended && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-red-500" />
              )}
              {/* Plan header */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-100">{plan.name}</span>
                  {isCurrentPlan && (
                    <span className="text-[10px] font-bold tracking-widest text-zinc-400 border border-zinc-700 px-1.5 py-0.5">
                      CURRENT
                    </span>
                  )}
                  {!isCurrentPlan && plan.badge && (
                    <span className="text-[10px] font-bold tracking-widest text-white bg-gradient-to-r from-purple-600 to-red-500 shadow-md px-1.5 py-0.5">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">{plan.subtitle}</p>
              </div>

              {/* Price */}
              <div>
                {price === null ? (
                  <div className="text-xl font-bold text-zinc-100">Custom</div>
                ) : price === 0 ? (
                  <div className="text-xl font-bold text-zinc-100">Free</div>
                ) : (
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xl font-bold text-zinc-100">${price}</span>
                    <span className="text-xs text-zinc-500">/mo</span>
                  </div>
                )}
                {interval === 'year' && price !== null && price > 0 && (
                  <p className="text-[11px] text-zinc-500 mt-0.5">billed annually</p>
                )}
              </div>

              {/* Highlights */}
              <ul className="flex flex-col gap-1.5">
                {plan.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                    <RiCheckLine className="size-3 text-zinc-500 shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>

              {/* Action button */}
              <div className="mt-auto pt-2">
                <PlanActionBtn
                  plan={plan}
                  interval={interval}
                  currentLevel={currentLevel}
                  isOnTrial={isOnTrial}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Feature Comparison Table ── */}
      <div className="border border-zinc-800 bg-zinc-900 shadow-xl">
        {/* Table header */}
        <div className="grid grid-cols-5 border-b border-zinc-800 bg-zinc-950">
          <div className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-widest">Feature</div>
          {PLANS.map((plan) => (
            <div key={plan.key} className="px-4 py-3 text-center text-xs font-semibold text-zinc-100">
              {plan.name}
            </div>
          ))}
        </div>

        {/* Feature sections */}
        {FEATURE_SECTIONS.map((section, si) => (
          <div key={section.title} className={si > 0 ? 'border-t border-zinc-800' : ''}>
            {/* Section header */}
            <div className="grid grid-cols-5 bg-zinc-900/50 border-b border-zinc-800">
              <div className="col-span-5 px-4 py-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                  {section.title}
                </span>
              </div>
            </div>

            {/* Rows */}
            {section.rows.map((row, ri) => (
              <div
                key={row.label}
                className={cn('grid grid-cols-5', ri < section.rows.length - 1 ? 'border-b border-zinc-800/50' : '')}
              >
                <div className="px-4 py-2.5 text-xs text-zinc-400">{row.label}</div>
                {(['free', 'pro', 'business', 'enterprise'] as PlanKey[]).map((pk) => (
                  <div key={pk} className="px-4 py-2.5 flex items-center justify-center">
                    <FeatureValue value={row[pk]} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
