import { AnimatedOutlet } from '@/components/animated-outlet';
import { DashboardLayout } from '@/components/dashboard-layout';
import { PageMeta } from '@/components/page-meta';
import { VariableList } from '@/components/variables/variable-list';

export const VariablesPage = () => {
  return (
    <>
      <PageMeta title="Secret Store" />
      <DashboardLayout headerStartItems={<h1 className="text-foreground-950 text-xl font-medium tracking-tight">Secret Store</h1>}>
        <VariableList />
        <AnimatedOutlet />
      </DashboardLayout>
    </>
  );
};
