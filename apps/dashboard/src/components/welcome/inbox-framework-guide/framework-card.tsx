import { motion } from 'motion/react';
import type { Framework } from '../framework-guides.instructions';

type FrameworkCardProps = {
  framework: Framework;
  isSelected: boolean;
  onSelect: (framework: Framework) => void;
};

export function FrameworkCard({ framework, isSelected, onSelect }: FrameworkCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      onClick={() => onSelect(framework)}
      className="relative flex flex-col items-center gap-2 border px-4 py-3.5 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
      style={{
        borderColor: isSelected ? '#7C3AED' : '#e5e7eb',
        backgroundColor: isSelected ? 'rgba(124,58,237,0.04)' : '#fff',
        boxShadow: isSelected
          ? '0 0 0 1px #7C3AED inset'
          : '0 1px 2px rgba(0,0,0,0.05)',
      }}
      aria-pressed={isSelected}
    >
      {/* Active indicator bar */}
      {isSelected && (
        <motion.div
          layoutId="framework-active-bar"
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, #7C3AED 0%, #DB2777 100%)' }}
        />
      )}

      <div className="text-2xl">{framework.icon}</div>
      <span
        className="text-[11px] font-medium leading-tight"
        style={{ color: isSelected ? '#7C3AED' : '#6b7280' }}
      >
        {framework.name}
      </span>
    </motion.button>
  );
}
