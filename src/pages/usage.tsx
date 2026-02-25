import { Box } from '@mui/material';
import { UsageHeader } from '@/component/usage/usage-header';
import { UsageStatsCards } from '@/component/usage/usage-stats-cards';
import { UsageTrendCard } from '@/component/usage/usage-trend-card';
import { UsageSmartInsights } from '@/component/usage/usage-smart-insights';
import { UsageDailyTable } from '@/component/usage/usage-daily-table';

export const Usage = () => {
  return (
    <Box>
      <UsageHeader />
      <UsageStatsCards />
      <UsageTrendCard />
      <UsageSmartInsights />
      <UsageDailyTable />
    </Box>
  );
};
