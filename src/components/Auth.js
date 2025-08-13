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

  // In Auth.js - enhance the content
return (
  <div className="auth-container">
    <div className="auth-card">
    <h1>NexusChatAI</h1>
      <h2>Welcome!</h2>
      <p>Sign in to continue your conversation or create a new account.</p>
      
      <form className="auth-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <div className="button-group">
          <button 
            type="button" 
            onClick={handleSignIn} 
            disabled={isLoading}
          >
            {signInLoading ? 'Signing In...' : 'Sign In'}
          </button>
          <button 
            type="button" 
            onClick={handleSignUp} 
            disabled={isLoading}
          >
            {signUpLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </div>
      </form>
      
      {isError && (
        <div className="error-message">
          {error?.message || 'An error occurred'}
        </div>
      )}
    </div>
  </div>
);

};

export default Auth;