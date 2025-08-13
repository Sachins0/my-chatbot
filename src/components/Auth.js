// src/components/Auth.js
import React, { useState } from 'react';
import { useSignInEmailPassword, useSignUpEmailPassword } from '@nhost/react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signUpEmailPassword, isLoading: signUpLoading, isError: signUpError, error: signUpErrorData } = useSignUpEmailPassword();
  const { signInEmailPassword, isLoading: signInLoading, isError: signInError, error: signInErrorData } = useSignInEmailPassword();

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
    <div className="auth-container">
      <div className="auth-card">
        <h2>My AI Chatbot</h2>
        <p>Welcome! Sign in or create an account.</p>
        <form className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isError && <p className="error-message">{error?.message}</p>}

          <div className="button-group">
            <button onClick={handleSignIn} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Sign In'}
            </button>
            <button onClick={handleSignUp} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;