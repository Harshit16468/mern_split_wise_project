import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import OtpForm from './components/OtpForm';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Contacts from './components/Contacts';
import Login from './components/Login';
import Loginfrom from './components/Signin';
import Home from './components/Home';
import OAuthCallback from './components/OAuthCallback';
const CLIENT_ID = '716338759481-3t52ihgb9pa4ifk96mjnlehh8c0idr07.apps.googleusercontent.com';

const handleLoginSuccess = () => {
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=http://localhost:3000/oauth/callback&response_type=code&scope=https://www.googleapis.com/auth/contacts.readonly`;
};

const handleLoginFailure = (error) => {
  console.error('Login Failed:', error);
};
function App() {

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>

    <Router>
    <Routes>
        <Route path="/signup" element={<OtpForm />} />
        <Route path="/log" element={<Loginfrom />} />
        <Route path="/" element={<Home />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/login" element={<Login onSuccess={handleLoginSuccess} onFailure={handleLoginFailure}/>} />

    </Routes>
    </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
