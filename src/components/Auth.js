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
} from '@mui/material';
import { useSignInEmailPassword, useSignUpEmailPassword } from '@nhost/react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    signUpEmailPassword,
    isLoading: signUpLoading,
    isError: signUpError,
    error: signUpErrorData
  } = useSignUpEmailPassword();

  const {
    signInEmailPassword,
    isLoading: signInLoading,
    isError: signInError,
    error: signInErrorData
  } = useSignInEmailPassword();

  const handleSignUp = async (e) => {
    e.preventDefault();
    await signUpEmailPassword(email, password);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    await signInEmailPassword(email, password);
  };

  const isLoading = signUpLoading || signInLoading;
  const isError = signUpError || signInError;
  const error = signUpErrorData || signInErrorData;

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
              <Typography variant="h4" component="h1" gutterBottom>
                Welcome
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to continue your conversation or create a new account
              </Typography>
            </Box>

            {isError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error?.message || 'Authentication failed'}
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
                    disabled={isLoading}
                    sx={{ py: 1.5 }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    disabled={isLoading}
                    onClick={handleSignUp}
                    sx={{ py: 1.5 }}
                  >
                    Sign Up
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
