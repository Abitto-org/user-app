import { Box, Typography } from '@mui/material';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { pxToRem } from '@/util/font';

const categories = [
  {
    title: 'Getting Started',
    subtitle: 'Learn the basics of your gas account',
    links: ['How to link your meter', 'Understanding your bill'],
  },
  {
    title: 'Account Management',
    subtitle: 'Manage Account Settings',
    links: ['Link Multiple Meters', 'Update Contact Information'],
  },
  {
    title: 'Billing & Payments',
    subtitle: 'Questions on billing and payments',
    links: ['Payment method available', 'Wallet system'],
  },
];

export const HelpCategoryCards = () => {
  return (
    <Box
      display='grid'
      gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }}
      gap={1}
      mb={2}
    >
      {categories.map((item) => (
        <Box key={item.title} bgcolor='white' border='1px solid #ECECEC' borderRadius='10px' p={2.5}>
          <Typography fontSize={pxToRem(24)} variant='h5' fontWeight={700} mb={0.5}>
            {item.title}
          </Typography>
          <Typography color='text.secondary' fontSize={pxToRem(14)} mb={2}>
            {item.subtitle}
          </Typography>

          <Box borderTop='1px solid #ECECEC' pt={1.5}>
            {item.links.map((link) => (
              <Box
                key={link}
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                py={0.75}
                sx={{ cursor: 'pointer' }}
              >
                <Typography fontWeight={600} color='#424242' fontSize={pxToRem(14)}>
                  {link}
                </Typography>
                <NorthEastIcon sx={{ fontSize: 16, color: '#444' }} />
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
