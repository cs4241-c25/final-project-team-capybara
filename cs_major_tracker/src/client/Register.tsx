import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface RegisterResponse {
  success?: boolean;
  message?: string;
}

function Register(): JSX.Element {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  async function handleRegister(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username || !password) {
      setErrorMsg('Username or password missing.');
      return;
    }

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data: RegisterResponse = await response.json();
      if (response.ok && data.success) {
        setSuccessMsg('Registration successful! Please log in.');
        navigate('/login');
      } else {
        setErrorMsg(data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error('Error registering:', err);
      setErrorMsg('Server error occurred.');
    }
  }

  return (
    <div>
      <h1>Create a New Account</h1>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}

      <form onSubmit={handleRegister}>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <br />
        <button type="submit">Sign Up</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Log in here</Link>
      </p>
    </div>
  );
}

export default Register;
