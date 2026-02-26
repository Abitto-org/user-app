import { useState } from 'react';
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  Skeleton,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { useSelectedMeter } from '@/hooks/use-selected-meter';

export const MeterSelector = () => {
  const { selectedMeter, meters, isLoading, setMeterId } = useSelectedMeter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    if (meters.length > 0) setAnchorEl(e.currentTarget);
  };

  const handleSelect = (id: string) => {
    setMeterId(id);
    setAnchorEl(null);
  };

  if (isLoading) {
    return <Skeleton variant='rounded' width={180} height={40} sx={{ borderRadius: '32px' }} />;
  }

  if (meters.length === 0) {
    return (
      <Box
        display='flex'
        alignItems='center'
        gap={1}
        color='text.secondary'
        border='1px dashed #D0D5DD'
        borderRadius='32px'
        px={2}
        py={0.75}
      >
        <InboxOutlinedIcon sx={{ fontSize: 18 }} />
        <Typography fontSize={14}>No meters available</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        onClick={handleOpen}
        display='flex'
        alignItems='center'
        gap={1}
        bgcolor='#6699001A'
        borderRadius='32px'
        px={2}
        py={0.75}
        sx={{ cursor: 'pointer', userSelect: 'none', width: 'fit-content' }}
      >
        <Typography fontWeight={600} color='primary' noWrap>
          {selectedMeter?.meterNumber ?? 'Select Meter'}
        </Typography>
        <KeyboardArrowDownIcon sx={{ color: '#669900', fontSize: 20 }} />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            sx: { borderRadius: '12px', mt: 1, minWidth: 180, border: '0.5px solid', borderColor: '#659900' },
            elevation: 0,
          },
        }}
      >
        {meters.map((meter) => (
          <MenuItem
            key={meter.id}
            selected={meter.id === selectedMeter?.id}
            onClick={() => handleSelect(meter.id)}
          >
            <Typography fontWeight={500}>{meter.meterNumber}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
