import { ReactNode, useState, useEffect } from 'react';
import { HeaderNavigation } from '@/components/header-navigation/header-navigation';
import { MobileDesktopPrompt } from '@/components/mobile-desktop-prompt';
import { LegacySideNavigation } from '@/components/side-navigation/side-navigation';
import { cn } from '@/utils/ui';

type DashboardLayoutProps = {
  children: ReactNode;
  headerStartItems?: ReactNode;
  showSideNavigation?: boolean;
  showBridgeUrl?: boolean;
  contentClassName?: string;
};

export const DashboardLayout = ({
  children,
  headerStartItems,
  showSideNavigation = true,
  showBridgeUrl = true,
  contentClassName,
}: DashboardLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('notify-sidebar-collapsed');
    if (stored === 'true') {
      setIsSidebarCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('notify-sidebar-collapsed', next.toString());
      return next;
    });
  };

  return (
    <div className="relative flex h-full w-full bg-[#fafafa] dark:bg-[#000000]">
      {showSideNavigation && (
        <div 
          className={cn(
            "hidden md:block transition-all duration-300 ease-in-out border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#000000]",
            isSidebarCollapsed ? "w-16" : "w-64"
          )}
        >
          <LegacySideNavigation isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
        </div>
      )}
      <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
        <HeaderNavigation
          startItems={headerStartItems}
          hideBridgeUrl={!showBridgeUrl}
          showMobileNav={showSideNavigation}
          className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#000000] shrink-0"
        />

        <div className={cn("flex flex-1 flex-col min-h-0 overflow-y-auto overflow-x-hidden p-6 bg-[#fafafa] dark:bg-[#0a0a0a]", contentClassName)}>
          {children}
        </div>
      </div>
      <MobileDesktopPrompt />
    </div>
  );
};
