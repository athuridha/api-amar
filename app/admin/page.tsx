'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (data.success) {
                router.push('/admin/dashboard');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Network error');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 font-sans">
            <div className="bg-white p-12 rounded-2xl shadow-2xl w-full max-w-md text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl text-white font-bold shadow-lg">
                    R
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Admin Login
                </h1>
                <p className="text-gray-500 mb-8 font-medium">
                    Rumah123 Scraper Analytics
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="text-left">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-red-600 focus:ring-4 focus:ring-red-100 outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-gray-800 font-medium"
                        />
                    </div>

                    <div className="text-left">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-red-600 focus:ring-4 focus:ring-red-100 outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-gray-800 font-medium"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-red-200 transition-all duration-200 transform hover:-translate-y-0.5 mt-2
              ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-red-600 to-red-700 hover:shadow-xl hover:shadow-red-300'
                            }`}
                    >
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
