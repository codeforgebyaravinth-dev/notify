import type { Framework } from '../framework-guides.instructions';
import { FrameworkCard } from './framework-card';

type FrameworkGridProps = {
  frameworks: Framework[];
  selectedFrameworkName: string;
  onSelect: (framework: Framework) => void;
};

export function FrameworkGrid({ frameworks, selectedFrameworkName, onSelect }: FrameworkGridProps) {
  return (
    <div>
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
        Choose your framework
      </p>
      <div className="flex flex-wrap gap-2">
        {frameworks.map((framework) => (
          <FrameworkCard
            key={framework.name}
            framework={framework}
            isSelected={framework.name === selectedFrameworkName}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
