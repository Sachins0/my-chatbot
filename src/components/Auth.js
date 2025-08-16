// src/components/Auth.js
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Stack,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
// Import the correct Nhost hooks
import { useNhostClient, useSignInEmailPassword } from '@nhost/react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State to manage UI feedback
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [showSuccessView, setShowSuccessView] = useState(false);

  // Use the base Nhost client for sign-up
  const nhost = useNhostClient();
  
  // The sign-in hook is still fine to use as is
  const {
    signInEmailPassword,
    isLoading: signInLoading,
    error: signInErrorData,
  } = useSignInEmailPassword();

  // CORRECT SIGN-UP HANDLER
  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    // Call the signUp method directly from the Nhost client
    const { error } = await nhost.auth.signUp({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setFormError(error.message);
    } else {
      // If there's no error, the sign-up was successful.
      // Show the "Please verify" message.
      setShowSuccessView(true);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setFormError(null);
    await signInEmailPassword(email, password);
  };

  const isCurrentlyLoading = isLoading || signInLoading;
  const displayError = formError || signInErrorData?.message;

  // If sign up was successful, show the verification message.
  if (showSuccessView) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          p: 2,
        }}
      >
        <Container maxWidth="sm">
          <Card
            elevation={8}
            sx={{
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 3,
              textAlign: 'center',
            }}
          >
            <CardContent sx={{ p: isMobile ? 3 : 4 }}>
              <Typography variant="h5" component="h1" gutterBottom>
                Sign Up Successful!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Please check your email and click the verification link to continue.
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={8}
          sx={{
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: isMobile ? 3 : 4 }}>
            <Box textAlign="center" mb={3}>
              <Typography variant="h4" component="h1" gutterBottom>
                Nexus Chat AI
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in or create a new account
              </Typography>
            </Box>

            {displayError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {displayError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSignIn}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  variant="outlined"
                />
                <Stack 
                  direction={isMobile ? 'column' : 'row'} 
                  spacing={2}
                  sx={{ mt: 2 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isCurrentlyLoading}
                    sx={{ py: 1.5 }}
                  >
                    {signInLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    disabled={isCurrentlyLoading}
                    onClick={handleSignUp}
                    sx={{ py: 1.5 }}
                  >
                    {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Auth;
