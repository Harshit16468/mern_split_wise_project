import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';

import axios from 'axios';

const OAuthCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');

        if (code) {
            const fetchToken = async () => {
                try {
                    const response = await axios.post('http://localhost:3001/oauth2callback', { code });
                
                    const { access_token } = response.data;
                    localStorage.setItem('access_token', access_token);
                    console.log('Access token:', access_token);
                    navigate('/contacts');
                } catch (error) {
                    console.error('Error exchanging code for token', error);
                }
            };

            fetchToken();
        }
    }, [location, navigate]);

    return <div>Loading...</div>;
};
export default OAuthCallback;