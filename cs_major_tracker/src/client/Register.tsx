import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface RegisterResponse {
  success?: boolean;
  message?: string;
}

const Register: React.FC = () => {
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
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setErrorMsg(data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error('Error registering:', err);
      setErrorMsg('Server error occurred.');
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#AC2B37] text-black">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <img src="/wpi.png" alt="WPI Logo" className="h-12 w-auto mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-center mb-6">Create a New Account</h1>

        {errorMsg && <p className="text-red-500 text-center mb-4">{errorMsg}</p>}
        {successMsg && <p className="text-green-500 text-center mb-4">{successMsg}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
