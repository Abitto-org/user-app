import { pxToRem } from '@/util/font';
import { Box, Button, Skeleton, Typography } from '@mui/material';
import { useGetProfile } from '@/services/profile';

import upIcon from '@/assets/icons/up-icon.svg';
import { MeterSelector } from '@/shared/meter-selector';

interface DashboardHeaderProps {
  onBuyGas?: () => void;
}

export const DashboardHeader = ({ onBuyGas }: DashboardHeaderProps) => {
  const { data: user, isLoading } = useGetProfile();

  const firstName = user?.firstName ?? 'there';

  return (
    <>
      <Box
        width='100%'
        display='flex'
        flexDirection={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'stretch', md: 'center' }}
        justifyContent='space-between'
        gap={{ xs: 1.5, md: 2 }}
        mb={1.5}
      >
        {isLoading ? (
          <Skeleton width={280} height={46} />
        ) : (
          <Typography
            fontWeight={700}
            letterSpacing={0}
            fontSize={{ xs: pxToRem(30), sm: pxToRem(34), md: pxToRem(36) }}
            textTransform='capitalize'
            lineHeight={1.15}
          >
            Welcome, {firstName}
          </Typography>
        )}
        <Box
          display='flex'
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={{ md: 1.5, xs: 1.5 }}
          flexShrink={0}
          width={{ xs: '100%', md: 'auto' }}
          justifyContent={{ xs: 'stretch', sm: 'flex-start', md: 'flex-end' }}
        >
          <Button
            variant='text'
            sx={{
              whiteSpace: 'nowrap',
              px: 3,
              minHeight: 42,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Gift Gas 🎁
          </Button>
          <Button
            variant='contained'
            sx={{
              whiteSpace: 'nowrap',
              px: 3,
              minHeight: 42,
              width: { xs: '100%', sm: 'auto' },
            }}
            endIcon={<img src={upIcon} />}
            onClick={onBuyGas}
          >
            Buy gas
          </Button>
        </Box>
      </Box>
      <Box mb={2}>
        <MeterSelector />
      </Box>
    </>
  );
};
