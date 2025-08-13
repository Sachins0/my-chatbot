// src/App.js
import { useAuthenticationStatus } from '@nhost/react';
import Auth from './components/Auth'; // We will create this
import Chat from './components/Chat'; // We will create this
import './App.css'; 

function App() {
  // This hook checks if a user is logged in
  const { isAuthenticated, isLoading } = useAuthenticationStatus();

  // While Nhost is checking, show a loading message
  if (isLoading) return (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <span>Loading...</span>
  </div>
);

  // If the user is NOT logged in, show the Auth component
  if (!isAuthenticated) {
    return <Auth />;
  }

  // If the user IS logged in, show the main Chat component
  return <Chat />;
}

export default App;