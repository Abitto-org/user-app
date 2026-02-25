import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#669900',
    },
    secondary: {
      main: '#3266CC',
    },
  },
  typography: {
    fontFamily: 'Geist, sans-serif',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#669900',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#669900',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#669900',
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        size: 'medium',
        disableFocusRipple: true,
        disableRipple: true,
        disableTouchRipple: true,
      },
      styleOverrides: {
        root: {
          borderRadius: '32px',
          textTransform: 'inherit',
          borderColor: '#669900',
          fontWeight: 600,
          letterSpacing: 0,
          transition: 'all 160ms ease',
          '&:focus, &:focus-visible': {
            outline: 'none',
            boxShadow: 'none',
          },
          '&.Mui-disabled': {
            backgroundColor: '#D1D5DB',
            color: '#9CA3AF',
          },
          '&.MuiButton-contained': {
            backgroundColor: '#669900',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#558000',
              transform: 'translateY(-1px)',
              boxShadow: '0 8px 16px rgba(102, 153, 0, 0.28)',
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
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: '#EAECF0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
