import { IEnvironment } from '@novu/shared';
import { Cross2Icon } from '@radix-ui/react-icons';
import { RiAlertFill } from 'react-icons/ri';
import { Button } from '@/components/primitives/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '@/components/primitives/dialog';

interface DeleteEnvironmentDialogProps {
  environment?: IEnvironment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteEnvironmentDialog = ({
  environment,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteEnvironmentDialogProps) => {
  if (!environment) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Delete Environment</DialogTitle>
          <DialogDescription>
            Deleting <span className="font-bold">{environment.name}</span> will permanently remove this environment and
            all the data associated with it. Including integrations, workflows, and notifications. This action cannot be
            undone. Are you sure you want to proceed?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" mode="ghost" onClick={() => onOpenChange(false)} className="rounded-none">
            Cancel
          </Button>
          <Button variant="error" onClick={onConfirm} isLoading={isLoading} className="rounded-none">
            Delete {environment.name}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
