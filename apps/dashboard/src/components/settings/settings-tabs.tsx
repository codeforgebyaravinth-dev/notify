import { UserProfile as ClerkUserProfile, OrganizationProfile } from '@clerk/react';
import type { ClerkAppearanceTheme } from '@clerk/shared/types';
import {
  ApiServiceLevelEnum,
  FeatureFlagsKeysEnum,
  FeatureNameEnum,
  GetSubscriptionDto,
  getFeatureForTierAsBoolean,
  PermissionsEnum,
} from '@novu/shared';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import { RiBuilding2Line, RiMoneyDollarCircleLine, RiTeamLine, RiUserLine, RiShieldLine, RiSettings2Line } from 'react-icons/ri';
import { useLocation, useNavigate } from 'react-router-dom';
import { BillingRestrictedState } from '@/components/billing/billing-restricted-state';
import { NotifyBilling } from '@/components/billing/notify-billing';
import { OrganizationSettings } from '@/components/settings/organization-settings';
import { EE_AUTH_PROVIDER, IS_CLOUD } from '@/config';
import { useFeatureFlag } from '@/hooks/use-feature-flag';
import { useFetchSubscription } from '@/hooks/use-fetch-subscription';
import { useHasPermission } from '@/hooks/use-has-permission';
import { TeamMembers } from '@/utils/better-auth/components/team-members';
import { UserProfile as BetterAuthUserProfile } from '@/utils/better-auth/index';
import { ROUTES } from '@/utils/routes';
import { getRequiredTierLabelForFeature } from '@/utils/upgrade-tier';
import { cn } from '@/utils/ui';

const AFTER_LEAVE_ORG_URL = ROUTES.SIGNUP_ORGANIZATION_LIST;

const FADE_ANIMATION = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.18 },
} as const;

const SETTINGS_TABS = ['account', 'organization', 'team', 'billing'] as const;
export type SettingsTab = (typeof SETTINGS_TABS)[number];

export type SettingsTabRoutes = Record<SettingsTab, string>;

type SettingsTabsProps = {
  routes: SettingsTabRoutes;
  rootRoute: string;
};

const getClerkComponentAppearance = (isRbacEnabled: boolean): ClerkAppearanceTheme => ({
  variables: {
    colorPrimary: 'hsl(var(--bg-surface))',
    colorForeground: 'rgba(82, 88, 102, 0.95)',
    fontSize: '14px',
    borderRadius: '0px',
  },
  elements: {
    navbar: { display: 'none' },
    navbarMobileMenuRow: { display: 'none !important' },
    rootBox: { width: '100%', height: '100%' },
    cardBox: { display: 'block', width: '100%', height: '100%', boxShadow: 'none' },
    pageScrollBox: { padding: '0 !important' },
    header: { display: 'none' },
    profileSection: { borderBottom: 'none', borderTop: '1px solid hsl(var(--neutral-100))' },
    profileSectionTitleText: { color: 'hsl(var(--text-strong))' },
    page: { padding: '0 5px' },
    selectButton__role: { visibility: isRbacEnabled ? 'visible' : 'hidden' },
    formFieldRow__role: { visibility: isRbacEnabled ? 'visible' : 'hidden' },
    apiKeys: 'py-1',
  },
});

function checkRbacEnabled(subscription: GetSubscriptionDto | undefined, featureFlag: boolean) {
  const apiServiceLevel = subscription?.apiServiceLevel || ApiServiceLevelEnum.FREE;
  const rbacFeatureEnabled = getFeatureForTierAsBoolean(
    FeatureNameEnum.ACCOUNT_ROLE_BASED_ACCESS_CONTROL_BOOLEAN,
    apiServiceLevel
  );
  return rbacFeatureEnabled && featureFlag;
}

function resolveCurrentTab(pathname: string, routes: SettingsTabRoutes, rootRoute: string): SettingsTab {
  if (pathname === rootRoute) return 'organization';
  const entry = (Object.entries(routes) as Array<[SettingsTab, string]>).find(
    ([, url]) => pathname === url || pathname.startsWith(`${url}/`)
  );
  return entry?.[0] ?? 'organization';
}

type NavItem = {
  tab: SettingsTab;
  label: string;
  icon: React.ElementType;
  description: string;
};

const NAV_ITEMS: NavItem[] = [
  { tab: 'account', label: 'Account', icon: RiUserLine, description: 'Profile & security' },
  { tab: 'organization', label: 'Organization', icon: RiBuilding2Line, description: 'Name, branding & SSO' },
  { tab: 'team', label: 'Team', icon: RiTeamLine, description: 'Members & permissions' },
  { tab: 'billing', label: 'Billing', icon: RiMoneyDollarCircleLine, description: 'Plans & invoices' },
];

export function SettingsTabs({ routes, rootRoute }: SettingsTabsProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { subscription } = useFetchSubscription();
  const isRbacEnabledFlag = useFeatureFlag(FeatureFlagsKeysEnum.IS_RBAC_ENABLED, false);
  const isRbacEnabled = checkRbacEnabled(subscription, isRbacEnabledFlag);
  const has = useHasPermission();
  const hasBillingPermission = has({ permission: PermissionsEnum.BILLING_WRITE });

  const clerkAppearance = useMemo(() => getClerkComponentAppearance(isRbacEnabled), [isRbacEnabled]);
  const UserProfile = EE_AUTH_PROVIDER === 'clerk' ? ClerkUserProfile : BetterAuthUserProfile;

  const canShowBillingTab = true;
  const canManageBilling = hasBillingPermission;
  const brandingTierLabel = getRequiredTierLabelForFeature(FeatureNameEnum.PLATFORM_REMOVE_NOVU_BRANDING_BOOLEAN);

  const currentTab = resolveCurrentTab(location.pathname, routes, rootRoute);

  const handleTabChange = (tab: SettingsTab) => {
    if (tab === 'billing' && !canShowBillingTab) return;
    navigate(routes[tab]);
  };

  const visibleNavItems = NAV_ITEMS.filter((item) => item.tab !== 'billing' || canShowBillingTab);

  // Tab content metadata
  const tabMeta: Record<SettingsTab, { title: string; subtitle: string; icon: React.ElementType }> = {
    account: { title: 'Account', subtitle: 'Manage your personal profile and security settings', icon: RiUserLine },
    organization: { title: 'Organization', subtitle: 'Configure your organization settings and integrations', icon: RiBuilding2Line },
    team: { title: 'Team Members', subtitle: 'Invite members and manage roles and permissions', icon: RiTeamLine },
    billing: { title: 'Billing & Plans', subtitle: 'Manage your subscription, usage, and invoices', icon: RiMoneyDollarCircleLine },
  };

  const meta = tabMeta[currentTab];

  return (
    <div className="flex h-full w-full min-h-0">
      {/* Sidebar */}
      <nav className="w-[220px] shrink-0 border-r border-neutral-200 bg-neutral-50/50 flex flex-col h-full">
        {/* Sidebar header */}
        <div className="flex items-center gap-2 px-4 py-5 border-b border-neutral-200">
          <RiSettings2Line className="size-4 text-neutral-400" />
          <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">Settings</span>
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto py-2">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => handleTabChange(item.tab)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors group ${
                  isActive
                    ? 'bg-white border-r-2 border-r-neutral-900 text-neutral-900'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/70 border-r-2 border-r-transparent'
                }`}
              >
                <Icon className={`size-4 shrink-0 ${isActive ? 'text-neutral-900' : 'text-neutral-400 group-hover:text-neutral-600'}`} />
                <div className="min-w-0">
                  <div className={`text-sm font-medium leading-none ${isActive ? 'text-neutral-900' : ''}`}>{item.label}</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5 truncate">{item.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar footer */}
        <div className="border-t border-neutral-200 px-4 py-3">
          <p className="text-[11px] text-neutral-400">Notify Settings</p>
        </div>
      </nav>

      {/* Main content */}
      <div className={cn("flex-1 min-w-0 overflow-y-auto", currentTab === 'billing' && canShowBillingTab ? "bg-zinc-950 text-zinc-100" : "bg-white")}>
        <motion.div key={currentTab} {...FADE_ANIMATION} className="min-h-full flex flex-col">
          {/* Content header */}
          <div className={cn("border-b px-8 py-6", currentTab === 'billing' && canShowBillingTab ? "border-zinc-800" : "border-neutral-200")}>
            <div className="flex items-center gap-3">
              <div className={cn("flex items-center justify-center size-8 shrink-0", currentTab === 'billing' && canShowBillingTab ? "bg-zinc-900" : "bg-neutral-100")}>
                <meta.icon className={cn("size-4", currentTab === 'billing' && canShowBillingTab ? "text-zinc-400" : "text-neutral-700")} />
              </div>
              <div>
                <h1 className={cn("text-base font-semibold leading-none", currentTab === 'billing' && canShowBillingTab ? "text-zinc-100" : "text-neutral-900")}>{meta.title}</h1>
                <p className={cn("text-xs mt-1", currentTab === 'billing' && canShowBillingTab ? "text-zinc-400" : "text-neutral-500")}>{meta.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Tab content */}
          <div className={`px-8 py-6 flex-1 ${currentTab === 'billing' && canShowBillingTab ? 'max-w-[1200px]' : 'max-w-[860px]'}`}>

            {/* ACCOUNT TAB */}
            {currentTab === 'account' && (
              <div className="space-y-8">
                <SettingsSection
                  title="Profile"
                  description="Update your name, avatar, and email address."
                >
                  <UserProfile appearance={clerkAppearance}>
                    <UserProfile.Page label="account" />
                    <UserProfile.Page label="security" />
                  </UserProfile>
                </SettingsSection>

                <SettingsDivider />

                <SettingsSection
                  title="Security"
                  description="Manage your password, two-factor authentication, and active sessions."
                >
                  <UserProfile appearance={clerkAppearance}>
                    <UserProfile.Page label="security" />
                    <UserProfile.Page label="account" />
                  </UserProfile>
                </SettingsSection>
              </div>
            )}

            {/* ORGANIZATION TAB */}
            {currentTab === 'organization' && (
              <div className="space-y-8">
                {subscription?.apiServiceLevel === ApiServiceLevelEnum.FREE && canManageBilling && (
                  <div className="flex items-start gap-3 border border-amber-200 bg-amber-50 px-4 py-3">
                    <div className="shrink-0 mt-0.5 size-4 rounded-full bg-amber-400 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">!</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-amber-900">Remove Notify branding</p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        {brandingTierLabel
                          ? `Upgrade to the ${brandingTierLabel} plan to hide Notify branding from your notification channels.`
                          : 'Upgrade to a paid plan to hide Notify branding from your notification channels.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`${routes.billing}?utm_source=organization_settings_upgrade_prompt`)}
                      className="shrink-0 text-xs font-medium text-amber-900 underline underline-offset-2 hover:no-underline"
                    >
                      {brandingTierLabel ? `Upgrade to ${brandingTierLabel}` : 'Upgrade'}
                    </button>
                  </div>
                )}

                <SettingsSection
                  title="Organization Details"
                  description="Manage your organization's name, logo, and general settings."
                >
                  <OrganizationSettings clerkAppearance={clerkAppearance} />
                </SettingsSection>
              </div>
            )}

            {/* TEAM TAB */}
            {currentTab === 'team' && (
              <div className={`space-y-8 ${isRbacEnabled ? 'show-role-column' : 'hide-role-column'}`}>
                {isRbacEnabledFlag && !isRbacEnabled && canManageBilling && (
                  <div className="flex items-start gap-3 border border-blue-200 bg-blue-50 px-4 py-3">
                    <div className="shrink-0 mt-0.5">
                      <RiShieldLine className="size-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-900">Role-based access control available</p>
                      <p className="text-xs text-blue-700 mt-0.5">Upgrade to Team to get RBAC and add unlimited members.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`${routes.billing}?utm_source=team_members_upgrade_prompt`)}
                      className="shrink-0 text-xs font-medium text-blue-900 underline underline-offset-2 hover:no-underline"
                    >
                      Upgrade to Team
                    </button>
                  </div>
                )}

                <SettingsSection
                  title="Members"
                  description="Invite team members and manage their access levels."
                >
                  {EE_AUTH_PROVIDER === 'clerk' ? (
                    <OrganizationProfile appearance={clerkAppearance} afterLeaveOrganizationUrl={AFTER_LEAVE_ORG_URL}>
                      <OrganizationProfile.Page label="general" />
                    </OrganizationProfile>
                  ) : (
                    <TeamMembers appearance={clerkAppearance} />
                  )}
                </SettingsSection>
              </div>
            )}

            {/* BILLING TAB */}
            {currentTab === 'billing' && canShowBillingTab && (
              <div className="space-y-8">
                {canManageBilling ? <NotifyBilling /> : <BillingRestrictedState />}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────── */

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
      {/* Left label column */}
      <div className="w-full lg:w-[200px] lg:shrink-0">
        <h2 className="text-sm font-semibold text-neutral-900 leading-none">{title}</h2>
        {description && <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">{description}</p>}
      </div>
      {/* Right content column */}
      <div className="flex-1 min-w-0 overflow-hidden">{children}</div>
    </div>
  );
}

function SettingsDivider() {
  return <div className="h-px bg-neutral-100" />;
}
