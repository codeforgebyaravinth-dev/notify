import { motion } from 'motion/react';
import { RiFlashlightFill, RiArrowLeftLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/routes';

export function HeaderSection() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative border-b border-neutral-200 bg-white"
    >
      {/* Gradient accent bar */}
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ background: 'linear-gradient(90deg, #7C3AED 0%, #DB2777 50%, #EF4444 100%)' }}
        aria-hidden
      />

      <div className="flex items-center justify-between px-8 py-5">
        {/* Left: back + title */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(ROUTES.WELCOME)}
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 transition-colors hover:text-neutral-700"
          >
            <RiArrowLeftLine className="h-4 w-4" />
            Back
          </button>

          <div className="h-4 w-px bg-neutral-200" aria-hidden />

          <div className="flex items-center gap-2.5">
            <div
              className="flex h-7 w-7 items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)' }}
            >
              <RiFlashlightFill className="h-3.5 w-3.5 text-white" aria-hidden />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-neutral-900">Add Inbox to your app</h1>
              <p className="text-[11px] text-neutral-400">Select your framework and follow the setup steps</p>
            </div>
          </div>
        </div>

        {/* Right: live watcher badge */}
        <div className="flex items-center gap-2 border border-neutral-200 bg-neutral-50 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping bg-violet-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 bg-violet-500" />
          </span>
          <span className="text-[11px] font-medium text-neutral-600">Watching for integration</span>
        </div>
      </div>
    </motion.div>
  );
}
