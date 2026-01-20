import {useState} from "react";
import './LoginForm.css';
import {useAuth} from "../hooks/useAuth.js";

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await login(username,password);
            //This will update context and force rerender on success
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed!');
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try{
            await signup(username,password);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed!');
        }
    }

    return (
        <form className="loginForm" onSubmit={handleSubmit}>
            {error && <div className="error">{error}</div>}
            <p>Username: </p>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                />
            <p>Password: </p>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button type="submit">Login</button>
            <button onClick={handleSignUp}>Sign Up</button>
        </form>
    )
}

export default LoginForm;