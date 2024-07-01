import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Contacts from './components/Contacts';
import Login from './components/Login';
import Log from './components/Log';
import Navbar from './components/Navbar';
const CLIENT_ID = '716338759481-3t52ihgb9pa4ifk96mjnlehh8c0idr07.apps.googleusercontent.com';


function App() {

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>

    <Router>
    <Navbar/>

    <Routes>
        <Route path="/signup" element={<Log title="Signup with your email" log=""/>} />
        <Route path="/log" element={<Log title="Login with your email" log="login"/>} />
        <Route path="/contact" element={<Contacts />} />
        <Route path="/login" element={<Login/>} />
        
    </Routes>
    </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
