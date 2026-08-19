import { getProviderSquareIconFileName } from '@/utils/provider-square-icon';
import { cn } from '../../../utils/ui';

interface ProviderIconProps {
  providerId: string;
  providerDisplayName: string;
  className?: string;
  /** Overrides the icon filename derived from `providerId` (e.g. agent-scoped channel icons). */
  iconFileName?: string;
}

export function ProviderIcon({ providerId, providerDisplayName, className, iconFileName }: ProviderIconProps) {
  const isNotify = providerId.startsWith('notify-') || providerId === 'novu';
  const src = isNotify
    ? '/images/providers/light/square/notify.jpg'
    : `/images/providers/light/square/${iconFileName ?? getProviderSquareIconFileName(providerId)}.svg`;

  return (
    <img
      src={src}
      alt={providerDisplayName}
      className={cn('h-6 w-6 object-cover', isNotify ? 'rounded-md' : 'object-contain', className)}
    />
  );
}
