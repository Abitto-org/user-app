import { useState } from 'react';
import { DashboardProfileHeader } from '@/component/dashboard-profile-header';
import { SideBar } from '@/component/side-bar';
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';

const SIDEBAR_WIDTH = 300;

export const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  return (
    <Box display="flex" width="100%" minHeight="100vh">
      {/* Desktop: fixed sidebar */}
      {!isMobile && (
        <Box
          width={SIDEBAR_WIDTH}
          flexShrink={0}
          position="fixed"
          left={0}
          height="100vh"
        >
          <SideBar />
        </Box>
      )}

      {/* Mobile: drawer sidebar */}
      {isMobile && (
        <Drawer
          open={drawerOpen}
          onClose={toggleDrawer}
          PaperProps={{
            sx: { width: SIDEBAR_WIDTH },
          }}
        >
          <SideBar />
        </Drawer>
      )}

      {/* Main content */}
      <Box
        flexGrow={1}
        bgcolor="#fafafa"
        minHeight="100vh"
        ml={isMobile ? 0 : `${SIDEBAR_WIDTH}px`}
      >
        <DashboardProfileHeader onMenuToggle={isMobile ? toggleDrawer : undefined} />
        <Box px={{ xs: 2, sm: 3, md: 4 }} py={{ xs: 2, md: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
