import { DashboardProfileHeader } from '@/component/dashboard-profile-header';
import { SideBar } from '@/component/side-bar';
import { Box } from '@mui/material';
import type { ReactNode } from 'react';

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box display='flex' width='100%' minHeight='100vh'>
      <Box width={300} flexShrink={0} height='100vh'>
        <SideBar />
      </Box>

      <Box flexGrow={1} bgcolor='#fafafa' minHeight='100vh'>
        <DashboardProfileHeader />
        <Box p={2}>{children}</Box>
      </Box>
    </Box>
  );
};
