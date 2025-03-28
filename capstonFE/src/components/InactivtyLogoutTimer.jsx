import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const InactivityLogoutTimer = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const checkForInactivity = () => {
        const expireTimeString = localStorage.getItem('expireTime');
        const expireTime = expireTimeString ? parseInt(expireTimeString, 10) : 0;

        

        if (expireTime < Date.now() && location.pathname !== '/') {
            localStorage.removeItem('token');
            localStorage.removeItem('expireTime'); // Clear expireTime after logout
            alert('You have been logged out due to inactivity.'); // Notify the user
            navigate('/'); // Redirect to the main page
            window.location.reload(); // Force a page refresh
        }
    };

    const updateExpiryTime = () => {
        const expireTime = Date.now() + 5 * 60 * 1000; 
        localStorage.setItem('expireTime', expireTime.toString());
   
    };

    useEffect(() => {
        const interval = setInterval(() => {
            checkForInactivity();
        }, 5000); // Check for inactivity every 5 seconds

        return () => clearInterval(interval);
    }, [location]); // Add `location` as a dependency to re-check on route changes

    useEffect(() => {
        const events = ['click', 'keypress', 'scroll', 'mousemove'];

        const update = () => {
            updateExpiryTime();
        };

        events.forEach(event => window.addEventListener(event, update));

        return () => {
            events.forEach(event => window.removeEventListener(event, update));
        };
    }, []);

    return null;
};

export default InactivityLogoutTimer;