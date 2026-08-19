import { motion } from 'motion/react';
import type { IconType } from 'react-icons';
import { RiArrowRightLine, RiArrowRightUpLine } from 'react-icons/ri';
import { Button } from '../../primitives/button';

export type WelcomeBannerProps = {
  badgeLabel: string;
  badgeIcon: IconType;
  /** Tailwind text color class for the badge (controls icon + label tint). */
  badgeColorClassName: string;
  /** Tailwind background tint class for the badge pill. */
  badgeBackgroundClassName: string;
  title: string;
  description: string;
  ctaLabel: string;
  onCtaClick: () => void;
  learnMore?: { onClick: () => void };
};

export function WelcomeBanner({
  badgeLabel,
  badgeIcon: BadgeIcon,
  badgeColorClassName,
  badgeBackgroundClassName,
  title,
  description,
  ctaLabel,
  onCtaClick,
  learnMore,
}: WelcomeBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden border border-neutral-200 bg-white p-5 shadow-sm"
    >
      {/* Subtle top gradient accent */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, #7C3AED 0%, #DB2777 50%, #EF4444 100%)' }}
        aria-hidden
      />

      {/* Faint radial background glow and subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #111827 1px, transparent 1px), linear-gradient(to bottom, #111827 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 95% 50%, rgba(139,92,246,0.05) 0%, transparent 70%)',
        }}
        aria-hidden
      />

      <div className="relative flex flex-col gap-3">
        {/* Badge row */}
        <div className="flex items-center justify-between gap-3">
          <span
            className={`inline-flex items-center gap-1.5 py-1 pl-2 pr-3 text-xs font-semibold ${badgeBackgroundClassName} ${badgeColorClassName}`}
          >
            <BadgeIcon className="h-3.5 w-3.5" aria-hidden />
            {badgeLabel}
          </span>

          <Button
            variant="secondary"
            mode="outline"
            size="2xs"
            trailingIcon={RiArrowRightLine}
            onClick={onCtaClick}
            className="border-violet-200 text-violet-700 hover:border-violet-300 hover:bg-violet-50"
          >
            {ctaLabel}
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold leading-5 text-neutral-800">{title}</p>
          <p className="text-xs leading-4 text-neutral-500">
            {description}
            {learnMore ? (
              <>
                {' '}
                <button
                  type="button"
                  onClick={learnMore.onClick}
                  className="inline-flex items-center gap-0.5 font-medium text-violet-600 transition-colors hover:text-violet-800"
                >
                  Learn more
                  <RiArrowRightUpLine className="h-3.5 w-3.5" aria-hidden />
                </button>
              </>
            ) : null}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
