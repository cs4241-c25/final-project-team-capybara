import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // This allows cookies to be sent/received
        body: JSON.stringify({ username, password }),
      });

      const data: { success?: boolean; message?: string; token?: string } = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Invalid login');
      } else {
        localStorage.setItem('authenticated', 'true');
        navigate('/main');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('Server error occurred.');
    }
  }

  return (
    <div>
      <h1>Login</h1>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

      <form onSubmit={handleLogin}>
        <label>Username: </label>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <br />
        <label>Password: </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <button type="submit">Login</button>
      </form>

      {/* <a href="/auth/github">Login with GitHub</a> */}
      <p>
        Don’t have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default Login;
