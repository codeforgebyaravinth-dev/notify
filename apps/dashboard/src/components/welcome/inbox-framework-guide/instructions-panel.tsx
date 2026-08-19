import { AnimatePresence, motion } from 'motion/react';
import { useTelemetry } from '../../../hooks/use-telemetry';
import { TelemetryEvent } from '../../../utils/telemetry';
import { FrameworkCliInstructions, FrameworkInstructions } from '../framework-guides';
import type { Framework } from '../framework-guides.instructions';
import type { InstallationMethod } from './types';

type InstallationMethodSelectorProps = {
  installationMethod: InstallationMethod;
  onMethodChange: (method: InstallationMethod) => void;
};

function InstallationMethodSelector({ installationMethod, onMethodChange }: InstallationMethodSelectorProps) {
  const track = useTelemetry();

  const handleMethodChange = (method: InstallationMethod) => {
    track(TelemetryEvent.INBOX_IMPLEMENTATION_CLICKED, { method });
    onMethodChange(method);
  };

  const methods: { value: InstallationMethod; label: string }[] = [
    { value: 'ai-assist', label: 'AI Assist' },
    { value: 'manual', label: 'Manual' },
  ];

  return (
    <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Installation method</p>
      <div className="flex border border-neutral-200 bg-neutral-50">
        {methods.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => handleMethodChange(m.value)}
            className="relative px-4 py-1.5 text-xs font-medium transition-colors"
            style={{
              color: installationMethod === m.value ? '#7C3AED' : '#6b7280',
              backgroundColor: installationMethod === m.value ? '#fff' : 'transparent',
              boxShadow: installationMethod === m.value ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {installationMethod === m.value && (
              <motion.div
                layoutId="method-active"
                className="absolute inset-x-0 top-0 h-[2px]"
                style={{ background: 'linear-gradient(90deg, #7C3AED 0%, #DB2777 100%)' }}
              />
            )}
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}

type InstructionsPanelProps = {
  selectedFramework: Framework;
  installationMethod: InstallationMethod;
  showInstallationTabs: boolean;
  onMethodChange: (method: InstallationMethod) => void;
  footer?: React.ReactNode;
};

export function InstructionsPanel({
  selectedFramework,
  installationMethod,
  showInstallationTabs,
  onMethodChange,
  footer,
}: InstructionsPanelProps) {
  const isCliMethod = showInstallationTabs && installationMethod === 'cli';

  return (
    <div className="flex flex-col overflow-hidden border border-neutral-200 bg-white shadow-sm">
      {/* Panel header */}
      <div className="border-b border-neutral-100 px-6 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Setup instructions</p>
        <p className="mt-0.5 text-sm font-semibold text-neutral-800">{selectedFramework.name}</p>
      </div>

      <div className="overflow-y-auto p-6">
        {showInstallationTabs ? (
          <InstallationMethodSelector installationMethod={installationMethod} onMethodChange={onMethodChange} />
        ) : null}

        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedFramework.name}-${installationMethod}-${showInstallationTabs ? 'tabs' : 'manual-only'}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-full"
          >
            {isCliMethod ? (
              <FrameworkCliInstructions framework={selectedFramework} />
            ) : (
              <FrameworkInstructions framework={selectedFramework} hideCopyButton={!showInstallationTabs} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {footer && (
        <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-3">
          {footer}
        </div>
      )}
    </div>
  );
}
