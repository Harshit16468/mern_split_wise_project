import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';

function Login(){
    window.location.href="/log"

}
function Signup(){
    window.location.href="/signup"
}
function Home(){
    return (
        <div>
            <button onClick={Login}>Login</button>
            <button onClick={Signup}>Signup</button>
        </div>
    )
}
export default Home;