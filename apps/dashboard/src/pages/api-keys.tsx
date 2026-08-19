import { FeatureFlagsKeysEnum, IApiKey, PermissionsEnum } from '@novu/shared';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiDeleteBin2Line, RiEyeLine, RiEyeOffLine, RiLoopRightFill } from 'react-icons/ri';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { PageMeta } from '@/components/page-meta';
import { CopyButton } from '@/components/primitives/copy-button';
import { Form } from '@/components/primitives/form/form';
import { Input } from '@/components/primitives/input';
import { Skeleton } from '@/components/primitives/skeleton';
import { ExternalLink } from '@/components/shared/external-link';
import { useEnvironment } from '@/context/environment/hooks';
import { getRegionConfig, useRegion } from '@/context/region';
import { apiHostnameManager } from '@/utils/api-hostname-manager';
import { DashboardLayout } from '../components/dashboard-layout';
import { Button } from '../components/primitives/button';
import { Container } from '../components/primitives/container';
import { HelpTooltipIndicator } from '../components/primitives/help-tooltip-indicator';
import { showErrorToast, showSuccessToast } from '../components/primitives/sonner-helpers';
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/primitives/tooltip';
import { RegenerateApiKeysDialog } from '../components/regenerate-api-keys-dialog';
import { IS_SELF_HOSTED } from '../config';
import { useFeatureFlag } from '../hooks/use-feature-flag';
import { useCreateApiKey, useDeleteApiKey, useFetchApiKeys, useRegenerateApiKeys } from '../hooks/use-fetch-api-keys';
import { useHasPermission } from '../hooks/use-has-permission';

const MAX_SECRET_KEYS = 2;

// Convert https:// to wss:// for WebSocket URLs
const getWebSocketUrl = (url: string) => {
  if (!url) return url;
  return url.replace(/^https:\/\//, 'wss://');
};

interface ApiKeysFormData {
  apiKey: string;
  environmentId: string;
  identifier: string;
}

export function ApiKeysPage() {
  const apiKeysQuery = useFetchApiKeys();
  const { currentEnvironment } = useEnvironment();
  const { selectedRegion } = useRegion();
  const apiKeys = apiKeysQuery.data?.data;
  const isLoading = apiKeysQuery.isLoading;
  const [isRegenerateDialogOpen, setIsRegenerateDialogOpen] = useState(false);
  const [keyPendingDeletion, setKeyPendingDeletion] = useState<IApiKey | null>(null);
  const regenerateApiKeysMutation = useRegenerateApiKeys();
  const createApiKeyMutation = useCreateApiKey();
  const deleteApiKeyMutation = useDeleteApiKey();
  const has = useHasPermission();
  const canRegenerateApiKeys = has({ permission: PermissionsEnum.API_KEY_WRITE });
  const isMultipleSecretKeysAllowed = useFeatureFlag(FeatureFlagsKeysEnum.IS_MULTIPLE_SECRET_KEYS_ALLOWED);
  const hasMaxSecretKeys = (apiKeys?.length ?? 0) >= MAX_SECRET_KEYS;

  const form = useForm<ApiKeysFormData>({
    values: {
      apiKey: apiKeys?.[0]?.key ?? '',
      environmentId: currentEnvironment?._id ?? '',
      identifier: currentEnvironment?.identifier ?? '',
    },
  });

  const handleRegenerateKeys = async () => {
    try {
      await regenerateApiKeysMutation.mutateAsync();
      showSuccessToast('API keys regenerated successfully');
      setIsRegenerateDialogOpen(false);
    } catch (e: any) {
      const message = e?.message || 'Failed to regenerate API keys';
      showErrorToast(message);
    }
  };

  const handleCreateKey = async () => {
    try {
      await createApiKeyMutation.mutateAsync();
      showSuccessToast('New secret key generated');
    } catch (e: any) {
      const message = e?.message || 'Failed to generate a new secret key';
      showErrorToast(message);
    }
  };

  const handleDeleteKey = async () => {
    if (!keyPendingDeletion?.hash) return;

    try {
      await deleteApiKeyMutation.mutateAsync({ hash: keyPendingDeletion.hash });
      showSuccessToast('Secret key deleted');
      setKeyPendingDeletion(null);
    } catch (e: any) {
      const message = e?.message || 'Failed to delete the secret key';
      showErrorToast(message);
    }
  };

  if (!currentEnvironment) {
    return null;
  }

  // Use dynamic region from region selector
  const region = getRegionConfig(selectedRegion)?.name || selectedRegion.toUpperCase();

  return (
    <>
      <PageMeta title={`API Keys for ${currentEnvironment?.name} environment`} />
      <DashboardLayout headerStartItems={<h1 className="text-foreground-950 text-xl font-medium tracking-tight">API Keys</h1>}>
        <Container className="flex w-full max-w-[900px] flex-col gap-12 mt-8 px-4">
          <Form {...form}>
            {/* Secret Keys Section */}
            <section className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-medium text-foreground-950 tracking-tight">Secret Keys</h2>
                <p className="text-sm text-foreground-500">
                  Authenticate your Notify SDK requests. Keep these secure and never share them publicly.
                </p>
              </div>

              <div className="flex flex-col border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-[#000000] shadow-sm">
                <div className="grid grid-cols-[1fr_auto] items-center p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                  <span className="text-sm font-medium text-foreground-600">Key</span>
                  <span className="text-sm font-medium text-foreground-600 mr-12">Actions</span>
                </div>
                
                <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
                  {isLoading ? (
                    <div className="p-4"><Skeleton className="h-[40px] w-full" /></div>
                  ) : isMultipleSecretKeysAllowed ? (
                    apiKeys?.map((apiKey, index) => (
                      <div key={apiKey.hash ?? apiKey.key} className="p-4">
                        <SettingField
                          label=""
                          value={apiKey.key}
                          secret
                          showRegenerateButton={canRegenerateApiKeys && index === 0}
                          onRegenerateClick={() => setIsRegenerateDialogOpen(true)}
                          isRegenerateLoading={regenerateApiKeysMutation.isPending}
                          showDeleteButton={canRegenerateApiKeys && (apiKeys?.length ?? 0) > 1}
                          onDeleteClick={() => setKeyPendingDeletion(apiKey)}
                          isDeleteLoading={deleteApiKeyMutation.isPending && keyPendingDeletion?.hash === apiKey.hash}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="p-4">
                      <SettingField
                        label=""
                        value={form.getValues('apiKey')}
                        secret
                        showRegenerateButton={canRegenerateApiKeys}
                        onRegenerateClick={() => setIsRegenerateDialogOpen(true)}
                        isRegenerateLoading={regenerateApiKeysMutation.isPending}
                      />
                    </div>
                  )}
                </div>
                
                {canRegenerateApiKeys && isMultipleSecretKeysAllowed && (
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 flex justify-between items-center">
                     <p className="text-xs text-foreground-500">
                        Generate a new key to rotate, then delete the old one.
                     </p>
                     <Button
                        size="sm"
                        variant="primary"
                        className="rounded-md shadow-sm bg-foreground-950 text-background hover:bg-foreground-900 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors h-8 text-xs px-3"
                        onClick={handleCreateKey}
                        disabled={isLoading || hasMaxSecretKeys}
                        isLoading={createApiKeyMutation.isPending}
                      >
                        Create API Key
                      </Button>
                  </div>
                )}
              </div>
            </section>

            {/* Application Identifier Section */}
            <section className="flex flex-col gap-4 mt-8">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-medium text-foreground-950 tracking-tight">Public Identifier</h2>
                <p className="text-sm text-foreground-500">
                  Use this public identifier to connect Notify widgets in your frontend applications.
                </p>
              </div>

              <div className="flex flex-col border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-[#000000] shadow-sm">
                 <div className="p-4">
                    <SettingField
                      label=""
                      value={form.getValues('identifier')}
                      isLoading={isLoading}
                    />
                 </div>
              </div>
            </section>

            {/* API URLs Section */}
            <section className="flex flex-col gap-4 mt-8 mb-12">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-medium text-foreground-950 tracking-tight">Endpoints</h2>
                <p className="text-sm text-foreground-500">
                  Notify API and WebSocket URLs for your integrations.
                </p>
              </div>

              <div className="flex flex-col border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-[#000000] shadow-sm">
                <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
                  <div className="p-4">
                    <SettingField
                      label="REST API"
                      value={apiHostnameManager.getHostname()}
                    />
                  </div>
                  <div className="p-4">
                    <SettingField
                      label="WebSocket"
                      value={getWebSocketUrl(apiHostnameManager.getWebSocketHostname())}
                    />
                  </div>
                </div>
              </div>
            </section>
          </Form>
        </Container>
      </DashboardLayout>
      <RegenerateApiKeysDialog
        environment={currentEnvironment}
        open={isRegenerateDialogOpen}
        onOpenChange={setIsRegenerateDialogOpen}
        onConfirm={handleRegenerateKeys}
        isLoading={regenerateApiKeysMutation.isPending}
      />
      <ConfirmationModal
        open={!!keyPendingDeletion}
        onOpenChange={(open) => {
          if (!open) {
            setKeyPendingDeletion(null);
          }
        }}
        onConfirm={handleDeleteKey}
        title="Delete secret key"
        description={
          <span>
            The secret key ending in <span className="font-mono">…{keyPendingDeletion?.key?.slice(-4)}</span> will stop
            working within about a minute. Make sure none of your applications still use it before deleting.
          </span>
        }
        confirmButtonText="Delete key"
        confirmButtonVariant="error"
        isLoading={deleteApiKeyMutation.isPending}
      />
    </>
  );
}

interface SettingFieldProps {
  label: string;
  tooltip?: string;
  value?: string;
  secret?: boolean;
  isLoading?: boolean;
  readOnly?: boolean;
  showRegenerateButton?: boolean;
  onRegenerateClick?: () => void;
  isRegenerateLoading?: boolean;
  showDeleteButton?: boolean;
  onDeleteClick?: () => void;
  isDeleteLoading?: boolean;
}

function SettingField({
  label,
  tooltip,
  value,
  secret = false,
  isLoading = false,
  readOnly = true,
  showRegenerateButton = false,
  onRegenerateClick,
  isRegenerateLoading,
  showDeleteButton = false,
  onDeleteClick,
  isDeleteLoading,
}: SettingFieldProps) {
  const [showSecret, setShowSecret] = useState(false);

  const toggleSecretVisibility = () => {
    setShowSecret(!showSecret);
  };

  const maskSecret = (secret: string) => {
    return `${'•'.repeat(28)}${secret.slice(-4)}`;
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-foreground-950 font-medium inline-flex items-center gap-1 text-sm">
          {label}
          {tooltip && <HelpTooltipIndicator text={tooltip} />}
        </label>
      )}
      <div className="flex items-center gap-2">
        {isLoading ? (
          <>
            <Skeleton className="h-[40px] flex-1 rounded-none" />
            {secret && <Skeleton className="h-[40px] w-[40px] rounded-none" />}
            {showRegenerateButton && <Skeleton className="h-[40px] w-[40px] rounded-none" />}
            {showDeleteButton && <Skeleton className="h-[40px] w-[40px] rounded-none" />}
          </>
        ) : (
          <>
            <Input
              className="cursor-default font-mono text-neutral-600 dark:text-neutral-400 rounded-none bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 h-[40px]"
              value={secret ? (showSecret ? value : maskSecret(value ?? '')) : value}
              readOnly={readOnly}
              trailingNode={<CopyButton valueToCopy={value ?? ''} />}
              inlineTrailingNode={
                secret && (
                  <button type="button" onClick={toggleSecretVisibility} className="hover:text-foreground-950 transition-colors">
                    {showSecret ? (
                      <RiEyeOffLine className="text-text-sub" />
                    ) : (
                      <RiEyeLine className="text-text-sub" />
                    )}
                  </button>
                )
              }
            />
            {showRegenerateButton && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="md"
                    variant="secondary"
                    onClick={onRegenerateClick}
                    disabled={isRegenerateLoading}
                    className="h-[40px] min-w-[40px] p-0 rounded-none border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-foreground-950 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <RiLoopRightFill className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Regenerate API Key</TooltipContent>
              </Tooltip>
            )}
            {showDeleteButton && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="md"
                    variant="secondary"
                    onClick={onDeleteClick}
                    disabled={isDeleteLoading}
                    className="h-[40px] min-w-[40px] p-0 rounded-none border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-destructive hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                  >
                    <RiDeleteBin2Line className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete API Key</TooltipContent>
              </Tooltip>
            )}
          </>
        )}
      </div>
    </div>
  );
}
