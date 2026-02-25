import { Box, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { pxToRem } from '@/util/font';

const faqItems = Array.from({ length: 10 }).map(() => 'How to link your meter');

export const HelpFaqSection = () => {
  return (
    <Box bgcolor='white' border='1px solid #ECECEC' borderRadius='10px' p={2.5}>
      <Typography variant='h4' fontSize={pxToRem(24)} fontWeight={700} mb={0.5}>
        Frequently Asked Questions
      </Typography>
      <Typography color='text.secondary' fontSize={pxToRem(16)} mb={2.5}>
        View all your transactions
      </Typography>

      <Box
        display='grid'
        gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }}
        gap={1.5}
      >
        {faqItems.map((item, index) => (
          <Box
            key={`${item}-${index}`}
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            bgcolor='#F7F7F7'
            border='1px solid #EEEEEE'
            borderRadius='10px'
            px={2}
            py={1.5}
            sx={{ cursor: 'pointer' }}
          >
            <Typography fontWeight={600} fontSize={pxToRem(16)}>
              {item}
            </Typography>
            <KeyboardArrowDownIcon sx={{ color: '#444' }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
