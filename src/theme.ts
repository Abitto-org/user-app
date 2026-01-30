import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3266CC',
    },
    secondary: {
      main: '#669900',
    },
  },
  typography: {
    fontFamily: 'Geist, sans-serif',
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        size: 'medium',
      },
      styleOverrides: {
        root: {
          borderRadius: '32px',
          textTransform: 'inherit',
          '&.MuiButton-contained': {
            backgroundColor: '#669900',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#558000',
            },
          },
          '&.MuiButton-text': {
            backgroundColor: '#fff',
            color: '#558000',
          },
          '&.MuiButton-containedPrimary': {
            backgroundColor: '#669900',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#558000',
            },
          },
        },
      },
    },
  },
});

export default theme;
