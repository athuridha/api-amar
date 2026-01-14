'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
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
                body: JSON.stringify({ password }),
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
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
            fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h1 style={{
                    textAlign: 'center',
                    marginBottom: '8px',
                    color: '#1a202c',
                    fontSize: '24px'
                }}>
                    Admin Dashboard
                </h1>
                <p style={{
                    textAlign: 'center',
                    marginBottom: '24px',
                    color: '#718096',
                    fontSize: '14px'
                }}>
                    Rumah123 Scraper Analytics
                </p>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#4a5568',
                            fontSize: '14px',
                            fontWeight: 500
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter admin password"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '16px',
                                transition: 'border-color 0.2s',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#c41e3a'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>

                    {error && (
                        <div style={{
                            padding: '12px',
                            background: '#fed7d7',
                            color: '#c53030',
                            borderRadius: '8px',
                            marginBottom: '16px',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: loading ? '#a0aec0' : '#c41e3a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
