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
        flexDirection={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent='space-between'
        gap={2}
        mb={2}
      >
        {isLoading ? (
          <Skeleton width={280} height={48} />
        ) : (
          <Typography
            fontWeight='bold'
            letterSpacing={0}
            fontSize={{ xs: pxToRem(28), sm: pxToRem(34), md: pxToRem(40) }}
            textTransform='capitalize'
          >
            Welcome, {firstName}
          </Typography>
        )}
        <Box display='flex' flexDirection={{ md: 'row', xs: 'column' }} gap={{ md: 2, xs: 2 }} flexShrink={0} width={{ xs: '100%', md: 'auto' }}>
          <Button variant='text' sx={{ whiteSpace: 'nowrap', px: 3 }}>
            Gift Gas 🎁
          </Button>
          <Button
            variant='contained'
            sx={{ whiteSpace: 'nowrap', px: 3 }}
            endIcon={<img src={upIcon} />}
            onClick={onBuyGas}
          >
            Buy gas
          </Button>
        </Box>
      </Box>
      <MeterSelector />
    </>
  );
};
