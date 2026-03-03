import { DashboardProfileHeader } from '@/component/dashboard-profile-header';
import { SideBar } from '@/component/side-bar';
import { PwaInstallPrompt } from '@/component/pwa-install-prompt';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import dashboardIcon from '@/assets/icons/dashboard-icon.svg';
import usageIcon from '@/assets/icons/usage-icon.svg';
import transactionIcon from '@/assets/icons/transaction-icon.svg';
import settingsIcon from '@/assets/icons/settings-icon.svg';

const SIDEBAR_WIDTH = 300;
const MOBILE_TAB_HEIGHT = 70;

export const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { meterId } = useParams<{ meterId: string }>();

  const mobileTabs = [
    { title: 'Home', page: 'dashboard', icon: dashboardIcon },
    { title: 'Usage', page: 'usage', icon: usageIcon },
    { title: 'Transactions', page: 'transactions', icon: transactionIcon },
    { title: 'Settings', page: 'settings', icon: settingsIcon },
  ];

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

      {/* Main content */}
      <Box
        flexGrow={1}
        bgcolor="#fafafa"
        minHeight="100vh"
        ml={isMobile ? 0 : `${SIDEBAR_WIDTH}px`}
      >
        <DashboardProfileHeader />
        <Box
          px={{ xs: 2, sm: 3, md: 4 }}
          py={{ xs: 2, md: 3 }}
          pb={{ xs: `${MOBILE_TAB_HEIGHT + 18}px`, md: 3 }}
        >
          <Outlet />
        </Box>
      </Box>

      {isMobile && (
        <Box
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          height={`${MOBILE_TAB_HEIGHT}px`}
          bgcolor="white"
          borderTop="1px solid #EAECF0"
          zIndex={1200}
          display="grid"
          gridTemplateColumns="repeat(4, 1fr)"
        >
          {mobileTabs.map((tab) => {
            const isActive = pathname.endsWith(`/${tab.page}`);
            return (
              <Box
                key={tab.page}
                onClick={() => meterId && navigate(`/${meterId}/${tab.page}`)}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap={0.3}
                sx={{ cursor: 'pointer' }}
              >
                <Box
                  width={30}
                  height={30}
                  borderRadius="8px"
                  bgcolor={isActive ? '#6699001A' : 'transparent'}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <img src={tab.icon} alt={tab.title} />
                </Box>
                <Box
                  component="span"
                  sx={{
                    fontSize: 11,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#669900' : '#667085',
                  }}
                >
                  {tab.title}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      <PwaInstallPrompt />
    </Box>
  );
};
