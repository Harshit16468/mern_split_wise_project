import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const Login = ({ onSuccess, onFailure }) => {
    return (
        <GoogleLogin
            onSuccess={onSuccess}
            onFailure={onFailure}
            scope="https://www.googleapis.com/auth/contacts.readonly"
        />
    );
};

export default Login;
