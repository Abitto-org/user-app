import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import { Close, GetApp } from '@mui/icons-material';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'pwa-install-dismissed';

export const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed permanently
    if (localStorage.getItem(DISMISSED_KEY) === 'true') return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setVisible(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setVisible(false);
    setDeferredPrompt(null);
  };

  if (!visible) return null;

  return (
    <Paper
      elevation={4}
      sx={{
        position: 'fixed',
        bottom: { xs: 16, md: 24 },
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1300,
        borderRadius: '16px',
        overflow: 'hidden',
        width: { xs: 'calc(100% - 32px)', sm: 420 },
        maxWidth: 420,
      }}
    >
      <Box
        display='flex'
        alignItems='flex-start'
        gap={2}
        p={2.5}
      >
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          bgcolor='#669900'
          borderRadius='12px'
          p={1.5}
          flexShrink={0}
        >
          <GetApp sx={{ color: 'white', fontSize: 28 }} />
        </Box>

        <Box flex={1}>
          <Typography variant='subtitle1' fontWeight={700}>
            Install Abitto Energy
          </Typography>
          <Typography variant='body2' color='text.secondary' mt={0.5}>
            Add to your home screen for quick access and a better experience.
          </Typography>

          <Box display='flex' gap={1.5} mt={2}>
            <Button
              variant='contained'
              size='small'
              onClick={handleInstall}
              sx={{ px: 3 }}
            >
              Install
            </Button>
            <Button
              variant='text'
              size='small'
              onClick={handleDismiss}
              sx={{ color: '#888' }}
            >
              Not now
            </Button>
          </Box>
        </Box>

        <IconButton size='small' onClick={handleDismiss} sx={{ mt: -0.5, mr: -0.5 }}>
          <Close fontSize='small' />
        </IconButton>
      </Box>
    </Paper>
  );
};
