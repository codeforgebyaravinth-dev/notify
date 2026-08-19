import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { RiArrowRightSLine, RiCheckLine, RiExternalLinkLine, RiFlashlightFill } from 'react-icons/ri';
import { cn } from '@/utils/ui';
import { Button } from '../../primitives/button';

export type WelcomeStepStatus = 'completed' | 'pending';

export type WelcomeSetupStep = {
  id: string;
  title: ReactNode;
  description: ReactNode;
  status: WelcomeStepStatus;
  ctaLabel?: string;
  ctaTrailingIcon?: IconType;
  ctaDisabled?: boolean;
  onCtaClick?: () => void;
};

function StepIndicator({ status, index }: { status: WelcomeStepStatus; index: number }) {
  if (status === 'completed') {
    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center shadow-sm"
        style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)' }}
      >
        <RiCheckLine className="h-3.5 w-3.5 text-white" aria-hidden />
      </motion.div>
    );
  }

  return (
    <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center border-2 border-neutral-200 bg-white">
      <span className="text-xs font-semibold text-neutral-400">{index}</span>
    </div>
  );
}

function StepRow({
  step,
  index,
  isFirst,
  isLast,
}: {
  step: WelcomeSetupStep;
  index: number;
  isFirst: boolean;
  isLast: boolean;
}) {
  const isCompleted = step.status === 'completed';
  const TrailingIcon = step.ctaTrailingIcon ?? RiArrowRightSLine;

  return (
    <li
      className={cn(
        'group relative flex items-stretch gap-4 px-4 py-3.5 transition-colors duration-150',
        !isCompleted && 'hover:bg-violet-50/60'
      )}
    >
      {/* Connector line */}
      <div className="flex w-7 shrink-0 flex-col items-center self-stretch">
        <div className={cn('h-2 w-px', isFirst ? 'bg-transparent' : isCompleted ? 'bg-violet-300' : 'bg-neutral-200')} />
        <StepIndicator status={step.status} index={index} />
        <div className={cn('w-px flex-1', isLast ? 'bg-transparent' : isCompleted ? 'bg-violet-300' : 'bg-neutral-200')} />
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 items-start gap-3 py-0.5">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3
            className={cn(
              'text-sm font-semibold leading-5',
              isCompleted ? 'text-neutral-400 line-through' : 'text-neutral-800'
            )}
          >
            {step.title}
          </h3>
          <p className="mt-0.5 text-xs leading-4 text-neutral-500">{step.description}</p>
        </div>

        {!isCompleted && step.ctaLabel ? (
          <div className="ml-2 flex shrink-0 flex-col items-end gap-1.5 pt-0.5">
            <Button
              variant="secondary"
              mode="outline"
              size="2xs"
              trailingIcon={TrailingIcon}
              onClick={step.onCtaClick}
              disabled={step.ctaDisabled}
              className="border-violet-200 text-violet-700 hover:border-violet-300 hover:bg-violet-50"
            >
              {step.ctaLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </li>
  );
}

type SetupStepsCardProps = {
  steps: WelcomeSetupStep[];
  onLearnMore: () => void;
};

export function SetupStepsCard({ steps, onLearnMore }: SetupStepsCardProps) {
  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const totalCount = steps.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allDone = completedCount === totalCount;

  return (
    <div className="flex flex-col overflow-hidden border border-neutral-200 bg-white shadow-sm">
      {/* Card header */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)' }}
          >
            <RiFlashlightFill className="h-4 w-4 text-white" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-800">Setup checklist</p>
            <p className="text-xs text-neutral-400">
              {allDone ? "All done! You're ready to go live 🎉" : `${completedCount} of ${totalCount} completed`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLearnMore}
          className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 transition-colors hover:text-violet-800"
        >
          How it works
          <RiExternalLinkLine className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 w-full bg-neutral-100">
        <motion.div
          className="h-full"
          style={{ background: 'linear-gradient(90deg, #7C3AED 0%, #DB2777 100%)' }}
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Steps list */}
      <ol className="flex flex-col px-1 py-2">
        {steps.map((step, idx) => (
          <StepRow
            key={step.id}
            step={step}
            index={idx + 1}
            isFirst={idx === 0}
            isLast={idx === steps.length - 1}
          />
        ))}
      </ol>
    </div>
  );
}
