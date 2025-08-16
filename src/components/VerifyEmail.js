// src/components/VerifyEmail.js
import React, { useState } from 'react';
import { useSignOut, useNhostClient, useUserData } from '@nhost/react';

const VerifyEmail = () => {
  const { signOut } = useSignOut();
  const nhost = useNhostClient();
  const user = useUserData();
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleResendVerification = async () => {
    try {
      await nhost.auth.sendVerificationEmail({ email: user.email });
      setEmailSent(true);
      setError('');
    } catch (err) {
      setError(err.message);
      setEmailSent(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verify Your Email</h2>
        <p>A verification link has been sent to your email address:</p>
        <strong>{user?.email}</strong>
        <p style={{ marginTop: '1rem' }}>Please click the link to continue. You can close this tab after verifying.</p>

        <div className="button-group" style={{ marginTop: '1.5rem', flexDirection: 'column' }}>
          <button onClick={handleResendVerification} disabled={emailSent}>
            {emailSent ? 'Email Sent!' : 'Resend Verification Email'}
          </button>
          <button onClick={signOut} className="signout-button" style={{ width: '100%', marginTop: '0.5rem' }}>
            Sign Out
          </button>
        </div>

        {error && <p className="error-message" style={{ marginTop: '1rem' }}>{error}</p>}
      </div>
    </div>
  );
};

export default VerifyEmail;