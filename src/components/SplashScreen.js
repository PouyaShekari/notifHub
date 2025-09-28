// src/components/SplashScreen.js
import React, { useEffect, useState } from 'react';
import './SplashScreen.css'; // We'll create this next

const SplashScreen = ({ minimumDisplayTime = 3000 }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
        }, minimumDisplayTime);

        return () => clearTimeout(timer);
    }, [minimumDisplayTime]);

    if (!show) return null;


    const mode = localStorage.getItem('layoutMode') ?? 'light'

    return (
        <div className="splash-screen" style={mode === 'dark' ? {backgroundColor:'#000000'} : {backgroundColor:'#ffffff'}}>
            <div className="splash-content">
                {mode === 'light' ? (
                    <img
                        src="/logo192.png"
                        alt="App Logo"
                        className="splash-logo"
                    />
                ): (
                    <img
                        src="/splashLogo.png"
                        alt="App Logo"
                        className="splash-logo"
                    />
                )}
                <h1 className="splash-title" style={mode === 'dark' ? {color:'#ffffff'} : {color:'#000000'}}>سامانه اطلاع رسانی کاشف</h1>
                <div className="splash-spinner"></div>
            </div>
        </div>
    );
};

export default SplashScreen;