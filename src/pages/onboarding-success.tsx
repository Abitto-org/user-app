import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

export const OnboardingSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('onboardingCompleted', 'true');
    const timer = setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      height='100vh'
      width='100%'
      textAlign='center'
      px={3}
    >
      {/* Confetti + check icon */}
      <Box position='relative' mb={3}>
        {/* Confetti pieces */}
        <Box
          sx={{
            position: 'absolute',
            inset: -30,
            pointerEvents: 'none',
            '& span': {
              position: 'absolute',
              width: 8,
              height: 8,
              borderRadius: '2px',
              animation: 'confettiFade 2s ease-out forwards',
            },
            '@keyframes confettiFade': {
              '0%': { opacity: 1, transform: 'scale(1)' },
              '100%': { opacity: 0, transform: 'scale(0.5) translateY(10px)' },
            },
          }}
        >
          <span style={{ top: '5%', left: '15%', background: '#F59E0B', transform: 'rotate(45deg)' }} />
          <span style={{ top: '0%', left: '35%', background: '#8B5CF6', borderRadius: '50%', width: 6, height: 6 }} />
          <span style={{ top: '10%', left: '55%', background: '#3B82F6', width: 12, height: 4, borderRadius: '2px' }} />
          <span style={{ top: '0%', right: '20%', background: '#FBBF24', transform: 'rotate(-30deg)' }} />
          <span style={{ top: '20%', left: '5%', background: '#EC4899', borderRadius: '50%', width: 5, height: 5 }} />
          <span style={{ top: '15%', right: '10%', background: '#10B981', width: 10, height: 4 }} />
          <span style={{ top: '25%', left: '25%', background: '#06B6D4', borderRadius: '50%', width: 6, height: 6 }} />
          <span style={{ top: '5%', right: '35%', background: '#F97316', transform: 'rotate(60deg)' }} />
          <span style={{ bottom: '60%', left: '10%', background: '#EF4444', width: 6, height: 6, borderRadius: '50%' }} />
          <span style={{ bottom: '65%', right: '15%', background: '#A855F7', transform: 'rotate(-45deg)' }} />
        </Box>

        {/* Green check circle */}
        <CheckCircle
          sx={{
            fontSize: 80,
            color: '#217C38',
          }}
        />
      </Box>

      <Typography variant='h4' fontWeight='bold'>
        You're all set
      </Typography>
      <Typography variant='body1' color='text.secondary' mt={1}>
        Let's connect your gas meter.
      </Typography>
    </Box>
  );
};
