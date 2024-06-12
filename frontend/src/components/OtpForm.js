import React, { useState } from 'react';
import otpService from '../services/otpService';
import Message from './Message';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';

function OtpForm() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const sendOtp = () => {
    otpService.sendOtp(email)
      .then(response => {
        setMessage('OTP sent to your email');
      })
      .catch(error => {
        console.error(error);
        setMessage(error.response.data);
      });
  };

  const verifyOtp = () => {
    otpService.verifyOtp(email, otp)
      .then(response => {
        setMessage('Login successful');
        navigate('/login');

      })
      .catch(error => {
        console.error(error);
        setMessage('Invalid OTP');
      });
  };

  return (
    <div>
      <h2>Signup with OTP</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={sendOtp}>Send OTP</button>
      <br />
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={verifyOtp}>Verify OTP</button>
      <Message message={message} />
    </div>
  );
}

export default OtpForm;
