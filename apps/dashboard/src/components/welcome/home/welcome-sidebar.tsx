import { motion } from 'motion/react';
import type { IconType } from 'react-icons';
import {
  RiArrowRightUpLine,
  RiBookletLine,
  RiBuildingLine,
  RiCalendarScheduleLine,
  RiCodeSSlashLine,
  RiDatabase2Line,
  RiGithubLine,
  RiGroup2Line,
} from 'react-icons/ri';
import { BOOK_DEMO_URL, docsUrl } from '@/components/header-navigation/support-drawer-constants';
import { BotIcon } from '@/components/icons/bot';
import { useTelemetry } from '@/hooks/use-telemetry';
import { AGENTS_DOCS_OVERVIEW_URL } from '@/utils/agent-docs';
import { TelemetryEvent } from '@/utils/telemetry';

type SidebarLink = {
  label: string;
  description: string;
  href: string;
  icon: IconType;
  accent?: string;
};

const QUICK_LINKS: SidebarLink[] = [
  {
    label: 'Community',
    description: 'Join 5k+ developers',
    href: 'https://discord.novu.co',
    icon: RiGroup2Line,
    accent: '#5865F2',
  },
  {
    label: 'Book a demo',
    description: 'Talk to a human expert',
    href: BOOK_DEMO_URL,
    icon: RiCalendarScheduleLine,
    accent: '#7C3AED',
  },
  {
    label: 'Documentation',
    description: 'Guides & API reference',
    href: docsUrl(),
    icon: RiBookletLine,
    accent: '#DB2777',
  },
  {
    label: 'GitHub',
    description: 'Star us on GitHub',
    href: 'https://github.com/novuhq/novu',
    icon: RiGithubLine,
    accent: '#24292F',
  },
];

const LEARN_LINKS: SidebarLink[] = [
  {
    label: 'Agents',
    description: 'AI-powered conversations',
    href: AGENTS_DOCS_OVERVIEW_URL,
    icon: BotIcon,
    accent: '#7C3AED',
  },
  {
    label: 'Environments',
    description: 'Dev, staging, production',
    href: docsUrl('/platform/concepts/environments'),
    icon: RiDatabase2Line,
    accent: '#0891B2',
  },
  {
    label: 'Contexts',
    description: 'Dynamic workflow data',
    href: docsUrl('/platform/workflow/advanced-features/contexts/contexts-in-workflows'),
    icon: RiBuildingLine,
    accent: '#059669',
  },
  {
    label: 'Framework',
    description: 'Code-first notifications',
    href: docsUrl('/framework/overview'),
    icon: RiCodeSSlashLine,
    accent: '#EA580C',
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 8 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  }),
};

function SidebarSection({
  title,
  links,
  startIndex = 0,
}: {
  title: string;
  links: SidebarLink[];
  startIndex?: number;
}) {
  const telemetry = useTelemetry();

  return (
    <div className="flex flex-col gap-2">
      <p className="px-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">{title}</p>
      <div className="flex flex-col gap-1.5">
        {links.map((link, i) => {
          const Icon = link.icon;
          const accent = link.accent ?? '#7C3AED';

          return (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              custom={startIndex + i}
              variants={cardVariant}
              onClick={() =>
                telemetry(TelemetryEvent.RESOURCE_CLICKED, { title: link.label, url: link.href, section: title })
              }
              className="group flex items-center gap-3 border border-neutral-100 bg-white px-3.5 py-3 shadow-sm transition-all duration-150 hover:border-neutral-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              {/* Icon */}
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center transition-transform duration-150 group-hover:scale-105"
                style={{ backgroundColor: `${accent}14` }}
              >
                <Icon className="h-4 w-4 transition-colors duration-150" style={{ color: accent }} aria-hidden />
              </div>

              {/* Labels */}
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-medium leading-4 text-neutral-800">{link.label}</span>
                <span className="mt-0.5 truncate text-[11px] text-neutral-400">{link.description}</span>
              </div>

              {/* Arrow */}
              <RiArrowRightUpLine
                className="h-4 w-4 shrink-0 text-neutral-300 transition-all duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-500"
                aria-hidden
              />
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}

export function WelcomeSidebar() {
  return (
    <aside className="flex flex-col gap-5">
      <SidebarSection title="Quick links" links={QUICK_LINKS} startIndex={0} />
      <SidebarSection title="Learn" links={LEARN_LINKS} startIndex={QUICK_LINKS.length} />
    </aside>
  );
}
