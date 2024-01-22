
import { useState } from "react";
import { Navigate } from "react-router-dom";  
import apipath from '../api.js'

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);  

    async function register(ev) {
        ev.preventDefault();
        const response = await fetch(`${apipath}/register`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.status === 200) {
            alert('Registration successful');
            setRedirect(true);  // Set redirect to true on successful registration
        } else {
            alert('Registration failed');
        }
    }

    if (redirect) {
        return <Navigate to={'/login'} />;  // Redirect to the login page
    }
    return (
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input type="text"
                placeholder="username"
                value={username}
                onChange={ev => setUsername(ev.target.value)} />
            <input type="password"
                placeholder="password"
                value={password}
                onChange={ev => setPassword(ev.target.value)} />
            <button>Register</button>
        </form>
    );
}





