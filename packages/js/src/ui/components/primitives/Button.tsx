import { cva, VariantProps } from 'class-variance-authority';
import { splitProps } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';
import { cn, useStyle } from '../../helpers';
import type { AllAppearanceKey } from '../../types';

export const buttonVariants = cva(
  cn(
    'nt-inline-flex nt-gap-4 nt-items-center nt-justify-center nt-whitespace-nowrap nt-text-sm nt-font-medium nt-transition-colors disabled:nt-pointer-events-none disabled:nt-opacity-50 after:nt-absolute after:nt-content-[""] before:nt-content-[""] before:nt-absolute [&_svg]:nt-pointer-events-none [&_svg]:nt-shrink-0',
    `focus-visible:nt-outline-none focus-visible:nt-ring-2 focus-visible:nt-nt-rounded-none focus-visible:nt-ring-ring focus-visible:nt-ring-offset-2`
  ),
  {
    variants: {
      variant: {
        default:
          'nt-bg-gradient-to-b nt-from-20% nt-from-primary-foreground-alpha-200 nt-to-transparent nt-bg-gradient-to-r nt-from-purple-600 nt-to-red-500 nt-text-white nt-shadow-[0_0_0_0.5px_var(--nv-color-primary-600)] nt-relative before:nt-absolute before:nt-inset-0 before:nt-border before:nt-border-primary-foreground-alpha-100 after:nt-absolute after:nt-inset-0 after:nt-opacity-0 hover:after:nt-opacity-100 after:nt-transition-opacity after:nt-bg-gradient-to-b after:nt-from-primary-foreground-alpha-50 after:nt-to-transparent',
        secondary:
          'nt-bg-secondary nt-text-secondary-foreground nt-shadow-[0_0_0_0.5px_var(--nv-color-secondary-600)] nt-relative before:nt-absolute before:nt-inset-0 before:nt-border before:nt-border-secondary-foreground-alpha-100 after:nt-absolute after:nt-inset-0 after:nt-opacity-0 hover:after:nt-opacity-100 after:nt-transition-opacity after:nt-bg-gradient-to-b after:nt-from-secondary-foreground-alpha-50 after:nt-to-transparent',
        ghost: 'hover:nt-bg-neutral-alpha-100 nt-text-foreground-alpha-600 hover:nt-text-foreground-alpha-800',
        unstyled: '',
      },
      size: {
        none: '',
        iconSm: 'nt-p-1 nt-nt-rounded-none after:nt-nt-rounded-none before:nt-nt-rounded-none focus-visible:nt-nt-rounded-none',
        icon: 'nt-p-2.5 nt-nt-rounded-none before:nt-nt-rounded-none after:nt-nt-rounded-none focus-visible:nt-nt-rounded-none',
        default:
          'nt-h-6 nt-px-2 nt-py-1 nt-nt-rounded-none focus-visible:nt-nt-rounded-none before:nt-nt-rounded-none after:nt-nt-rounded-none',
        sm: 'nt-px-1 nt-py-px nt-nt-rounded-none nt-text-xs nt-px-1 before:nt-nt-rounded-none focus-visible:nt-nt-rounded-none after:nt-nt-rounded-none',
        lg: 'nt-px-8 nt-py-2 nt-text-base before:nt-nt-rounded-none after:nt-nt-rounded-none focus-visible:nt-nt-rounded-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonProps = JSX.IntrinsicElements['button'] & {
  appearanceKey?: AllAppearanceKey;
  context?: Record<string, unknown>;
} & VariantProps<typeof buttonVariants>;
export const Button = (props: ButtonProps) => {
  const [local, rest] = splitProps(props, ['class', 'appearanceKey', 'context']);
  const style = useStyle();

  return (
    <button
      data-variant={props.variant}
      data-size={props.size}
      class={style({
        key: local.appearanceKey || 'button',
        className: cn(buttonVariants({ variant: props.variant, size: props.size }), local.class),
        context: local.context,
      })}
      {...rest}
    />
  );
};
