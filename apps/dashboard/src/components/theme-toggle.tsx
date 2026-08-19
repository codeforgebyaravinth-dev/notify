import { RiMoonLine, RiSunLine } from 'react-icons/ri';
import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      className="inline-flex h-8 w-8 items-center justify-center border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-black dark:text-neutral-400 dark:hover:bg-neutral-900"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <RiSunLine className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <RiMoonLine className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
