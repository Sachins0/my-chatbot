// src/App.js
import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
// Import the hooks we need for verification
import { useAuthenticationStatus, useUserData } from '@nhost/react'; 
import Auth from './components/Auth';
import Chat from './components/Chat';
import VerifyEmail from './components/VerifyEmail'; // Import the new component
import { Box, CircularProgress } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
      light: '#8b87f7',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

function App() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const user = useUserData(); // Get the current user's data

  // This function will decide which component to render
  const renderContent = () => {
    if (isLoading) {
      return (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="100vh"
          bgcolor="background.default"
        >
          <CircularProgress size={40} />
        </Box>
      );
    }

    if (!isAuthenticated) {
      return <Auth />;
    }

    // NEW LOGIC: If authenticated but not verified, show the VerifyEmail component
    // We also check if the user object exists before trying to read a property on it.
    if (user && !user.emailVerified) {
      return <VerifyEmail />;
    }

    // If authenticated and verified, show the Chat component
    return <Chat />;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {renderContent()}
    </ThemeProvider>
  );
}

export default App;
