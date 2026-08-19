import { motion } from 'motion/react';
import { RiFlashlightFill, RiShieldCheckLine, RiRocketLine } from 'react-icons/ri';
import { useAuth } from '@/context/auth/hooks';

const pill = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 22 } },
};

export function WelcomeHeading() {
  const { currentUser } = useAuth();
  const firstName = currentUser?.firstName?.trim();

  return (
    <div className="relative overflow-hidden border border-neutral-200 bg-white shadow-sm">
      {/* Subtle gradient mesh and grid background */}
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
            'radial-gradient(ellipse 80% 60% at 10% 0%, rgba(139,92,246,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 100%, rgba(239,68,68,0.05) 0%, transparent 60%)',
        }}
        aria-hidden
      />

      {/* Thin gradient accent bar */}
      <div
        className="absolute left-0 right-0 top-0 h-[3px]"
        style={{ background: 'linear-gradient(90deg, #7C3AED 0%, #DB2777 50%, #EF4444 100%)' }}
        aria-hidden
      />

      <div className="relative flex flex-col items-start gap-4 px-8 py-7 sm:flex-row sm:items-center">
        {/* Icon */}
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center shadow-md"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)' }}
        >
          <RiFlashlightFill className="h-7 w-7 text-white" aria-hidden />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            {firstName ? `Welcome back, ${firstName}! ✨` : 'Welcome to Notify! ✨'}
          </h1>
          <p className="text-sm leading-relaxed text-neutral-500">
            Your notification infrastructure is ready. Follow the steps below to go live.
          </p>
        </div>

        {/* Status pills */}
        <div className="ml-auto flex shrink-0 flex-wrap gap-2">
          {[
            { icon: RiShieldCheckLine, label: 'Production Ready' },
            { icon: RiRocketLine, label: '99.9% Uptime' },
          ].map(({ icon: Icon, label }) => (
            <motion.span
              key={label}
              variants={pill}
              className="inline-flex items-center gap-1.5 border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600"
            >
              <Icon className="h-3.5 w-3.5 text-violet-500" aria-hidden />
              {label}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
