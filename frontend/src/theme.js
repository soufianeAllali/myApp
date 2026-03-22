import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1565c0',   
      light: '#5e92f3',  
      dark: '#003c8f',   
    },
    secondary: {
      main: '#ff6f00',   
      light: '#ffa040',  
      dark: '#c43e00',
    },
    background: {
      default: '#f5f5f5', 
      paper: '#ffffff',   
    },
    text: {
      primary: '#212121', 
      secondary: '#616161', 
    },
    error: {
      main: '#d32f2f',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '2rem' },
    h2: { fontWeight: 600, fontSize: '1.75rem' },
    h3: { fontWeight: 500, fontSize: '1.5rem' },
    h4: { fontWeight: 500, fontSize: '1.25rem' },
    h5: { fontWeight: 500, fontSize: '1rem' },
    h6: { fontWeight: 500, fontSize: '0.875rem' },
    body1: { fontSize: '0.95rem' },
    body2: { fontSize: '0.85rem', color: '#616161' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,          
          padding: '8px 16px',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: 16,
          boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

export default theme;