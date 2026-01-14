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
                padding: '48px',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                width: '100%',
                maxWidth: '380px',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #c41e3a, #e53e3e)',
                    borderRadius: '20px',
                    margin: '0 auto 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                    R
                </div>

                <h1 style={{
                    marginBottom: '8px',
                    color: '#1a202c',
                    fontSize: '28px',
                    fontWeight: 700
                }}>
                    Admin Panel
                </h1>
                <p style={{
                    marginBottom: '32px',
                    color: '#718096',
                    fontSize: '14px'
                }}>
                    Rumah123 Scraper Analytics
                </p>

                <form onSubmit={handleLogin}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter admin password"
                        style={{
                            width: '100%',
                            padding: '16px 20px',
                            border: '2px solid #e2e8f0',
                            borderRadius: '12px',
                            fontSize: '16px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            textAlign: 'center',
                            marginBottom: '16px',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#c41e3a'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />

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
                            padding: '16px',
                            background: loading ? '#a0aec0' : 'linear-gradient(135deg, #c41e3a, #e53e3e)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            boxShadow: '0 4px 15px rgba(196, 30, 58, 0.3)'
                        }}
                        onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
