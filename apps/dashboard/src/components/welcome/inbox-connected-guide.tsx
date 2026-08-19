import { IEnvironment } from '@novu/shared';
import { motion } from 'motion/react';
import { useEffect, useMemo } from 'react';
import {
  RiArrowRightLine,
  RiCheckLine,
  RiFlashlightFill,
  RiLoader4Line,
  RiTerminalBoxLine,
  RiErrorWarningLine,
} from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { useFetchApiKeys } from '@/hooks/use-fetch-api-keys';
import { useFirstTriggerDetection } from '@/hooks/use-first-trigger-detection';
import { usePageVisitTimestamp } from '@/hooks/use-page-visit-timestamp';
import { useTelemetry } from '@/hooks/use-telemetry';
import { type CodeSnippet, createCurlSnippet } from '@/utils/code-snippets';
import { TelemetryEvent } from '@/utils/telemetry';
import { ONBOARDING_DEMO_WORKFLOW_ID } from '../../config';
import { useInitDemoWorkflow } from '../../hooks/use-init-demo-workflow';
import { ROUTES } from '../../utils/routes';
import { CodeBlock } from '../primitives/code-block';
import { ToastIcon } from '../primitives/sonner';
import { showErrorToast, showToast } from '../primitives/sonner-helpers';

type InboxConnectedGuideProps = {
  subscriberId: string;
  environment: IEnvironment;
};

function generateCurlSnippet(userId: string, apiKey: string): string {
  if (!apiKey) throw new Error('API key not found');
  if (!userId || !userId.trim()) throw new Error('User ID not found');

  const snippetProps: CodeSnippet = {
    identifier: ONBOARDING_DEMO_WORKFLOW_ID,
    to: { subscriberId: userId },
    payload: '{}',
    secretKey: apiKey,
  };

  return createCurlSnippet(snippetProps);
}

function showStatusToast(variant: 'success' | 'error', message: string) {
  showToast({
    children: () => (
      <>
        <ToastIcon variant={variant} />
        <span className="text-sm">{message}</span>
      </>
    ),
    options: {
      position: 'bottom-center',
      style: { left: '50%', transform: 'translateX(-50%)' },
    },
  });
}

type StepStatus = 'done' | 'loading' | 'error' | 'waiting';

function Step({
  number,
  title,
  description,
  status,
  isLast = false,
}: {
  number: number;
  title: string;
  description: string;
  status: StepStatus;
  isLast?: boolean;
}) {
  return (
    <div className="flex gap-4">
      {/* Indicator column */}
      <div className="flex flex-col items-center">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center"
          style={{
            background:
              status === 'done'
                ? 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)'
                : status === 'error'
                  ? '#FEE2E2'
                  : status === 'loading'
                    ? 'rgba(124,58,237,0.08)'
                    : '#F3F4F6',
          }}
        >
          {status === 'done' ? (
            <RiCheckLine className="h-4 w-4 text-white" />
          ) : status === 'error' ? (
            <RiErrorWarningLine className="h-4 w-4 text-red-600" />
          ) : status === 'loading' ? (
            <RiLoader4Line className="h-4 w-4 animate-spin text-violet-600" />
          ) : (
            <span className="text-xs font-semibold text-neutral-400">{number}</span>
          )}
        </div>
        {!isLast && (
          <div
            className="mt-1 w-px flex-1"
            style={{
              background: status === 'done' ? 'linear-gradient(180deg, #7C3AED 0%, #DB2777 100%)' : '#E5E7EB',
              minHeight: 24,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 pb-6 pt-1">
        <p
          className="text-sm font-semibold"
          style={{ color: status === 'done' ? '#7C3AED' : status === 'error' ? '#DC2626' : '#111827' }}
        >
          {title}
        </p>
        <p className="text-xs leading-relaxed text-neutral-500">{description}</p>
      </div>
    </div>
  );
}

export function InboxConnectedGuide({ subscriberId, environment }: InboxConnectedGuideProps) {
  const navigate = useNavigate();
  const telemetry = useTelemetry();
  useInitDemoWorkflow(environment);

  const apiKeysQuery = useFetchApiKeys();
  const apiKeys = apiKeysQuery.data?.data ?? [];
  const apiKey = apiKeys[0]?.key ?? '';
  const hasValidApiKey = !apiKeysQuery.isLoading && !apiKeysQuery.error && apiKey;

  const visitTimestamp = usePageVisitTimestamp();
  const curl = useMemo(
    () => (apiKey && subscriberId ? generateCurlSnippet(subscriberId, apiKey) : ''),
    [apiKey, subscriberId]
  );

  const {
    hasDetectedFirstTrigger,
    isWaitingForTrigger,
    startWaiting,
    isLoading: isTriggerDetectionLoading,
    error: triggerDetectionError,
    isError: isTriggerDetectionError,
    workflowsError,
    isWorkflowsError,
  } = useFirstTriggerDetection({
    enabled: true,
    firstVisitTimestamp: visitTimestamp,
    onFirstTriggerDetected: () => {
      showStatusToast('success', 'API trigger detected');
    },
  });

  const hasError = isTriggerDetectionError || isWorkflowsError;

  useEffect(() => {
    if (isTriggerDetectionError && triggerDetectionError) {
      console.error('Trigger detection error:', triggerDetectionError);
      showErrorToast('Failed to detect API trigger. Please refresh and try again.', 'Detection Error');
    }
  }, [isTriggerDetectionError, triggerDetectionError]);

  useEffect(() => {
    if (isWorkflowsError && workflowsError) {
      console.error('Workflows loading error:', workflowsError);
      showErrorToast('Failed to load workflows. Please refresh and try again.', 'Loading Error');
    }
  }, [isWorkflowsError, workflowsError]);

  useEffect(() => {
    if (hasValidApiKey && !hasDetectedFirstTrigger && !isWaitingForTrigger) {
      const timer = setTimeout(() => startWaiting(), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasValidApiKey, hasDetectedFirstTrigger, isWaitingForTrigger, startWaiting]);

  async function handleCompleteOnboarding() {
    try {
      await telemetry(TelemetryEvent.ONBOARDING_COMPLETED, { usecase: 'inbox' });
    } catch (error) {
      console.error('Failed to track onboarding completion telemetry:', error);
    }
    try {
      navigate(ROUTES.INBOX_EMBED_SUCCESS);
    } catch (error) {
      console.error('Failed to navigate after onboarding completion:', error);
      showErrorToast('Failed to complete onboarding. Please refresh the page.', 'Navigation Error');
    }
  }

  const triggerStatus: StepStatus = isTriggerDetectionLoading
    ? 'loading'
    : hasError
      ? 'error'
      : hasDetectedFirstTrigger
        ? 'done'
        : 'loading';

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      {/* Page header */}
      <div className="relative border-b border-neutral-200 bg-white">
        <div
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{ background: 'linear-gradient(90deg, #7C3AED 0%, #DB2777 50%, #EF4444 100%)' }}
          aria-hidden
        />
        <div className="flex items-center gap-3 px-8 py-5">
          <div
            className="flex h-7 w-7 items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)' }}
          >
            <RiFlashlightFill className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-neutral-900">Inbox Connected</h1>
            <p className="text-[11px] text-neutral-400">Test your first notification trigger</p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex flex-1 gap-8 p-8"
      >
        {/* Left: progress steps */}
        <div className="w-72 shrink-0">
          <div className="border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-100 px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Setup Progress</p>
            </div>
            <div className="px-5 py-5">
              <Step
                number={1}
                title="In-App channel activated"
                description="Your Inbox component is initialized and connected to Notify."
                status="done"
              />
              <Step
                number={2}
                title={
                  isTriggerDetectionLoading
                    ? 'Setting up detection...'
                    : hasError
                      ? 'Detection error'
                      : hasDetectedFirstTrigger
                        ? 'API trigger detected!'
                        : 'Waiting for first trigger...'
                }
                description={
                  hasError
                    ? 'There was an error. Please refresh the page.'
                    : hasDetectedFirstTrigger
                      ? 'We detected your API call. Click "Complete Setup" to finish.'
                      : 'Run the code snippet on the right to send your first notification.'
                }
                status={triggerStatus}
                isLast
              />
            </div>

            {/* CTA */}
            <div className="border-t border-neutral-100 px-5 py-4">
              <button
                type="button"
                onClick={handleCompleteOnboarding}
                className="flex w-full items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)' }}
              >
                Complete Setup
                <RiArrowRightLine className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: code snippet */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="border border-neutral-200 bg-white shadow-sm">
            <div className="flex items-center gap-2.5 border-b border-neutral-100 px-5 py-4">
              <RiTerminalBoxLine className="h-4 w-4 text-neutral-400" />
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                Trigger your first notification
              </p>
            </div>
            <div className="p-5">
              {apiKeysQuery.isLoading ? (
                <div className="flex items-center gap-3 py-8 text-sm text-neutral-500">
                  <RiLoader4Line className="h-5 w-5 animate-spin text-violet-500" />
                  Loading API key...
                </div>
              ) : apiKeysQuery.error ? (
                <div className="flex flex-col gap-2 py-6 text-sm">
                  <p className="font-medium text-red-600">⚠️ Error loading API key</p>
                  <p className="text-neutral-500">
                    Please check your connection and{' '}
                    <button
                      onClick={() => apiKeysQuery.refetch()}
                      className="font-medium text-violet-600 underline underline-offset-2 hover:text-violet-800"
                    >
                      try again
                    </button>
                    .
                  </p>
                </div>
              ) : !apiKey ? (
                <div className="flex flex-col gap-2 py-6 text-sm">
                  <p className="font-medium text-amber-600">⚠️ No API key found</p>
                  <p className="text-neutral-500">
                    Please generate an API key in{' '}
                    <a
                      href="/settings"
                      className="font-medium text-violet-600 underline underline-offset-2 hover:text-violet-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      settings
                    </a>{' '}
                    first.
                  </p>
                </div>
              ) : (
                <CodeBlock code={curl} language="shell" title="Terminal" />
              )}
            </div>
          </div>

          <p className="text-xs text-neutral-400">
            Copy the snippet above, paste it in your terminal, and run it. We'll detect the trigger automatically.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
