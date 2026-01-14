'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Loader2, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState<'username' | 'password'>('username');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 'username') {
            if (username) {
                setStep('password');
                setError('');
            }
        } else {
            handleLogin(e);
        }
    };

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
                if (data.error?.toLowerCase().includes('user')) {
                    setStep('username');
                }
            }
        } catch (err) {
            setError('Network error');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans text-gray-900">
            <div className="w-full max-w-[400px] px-8 py-12 flex flex-col items-center animate-fade-in">

                {/* Apple-style Avatar Icon */}
                <div className="w-24 h-24 mb-6 rounded-full bg-gray-100 flex items-center justify-center relative overflow-hidden shadow-inner">
                    <User className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
                    {step === 'password' && (
                        <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center animate-pulse">
                            <User className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
                        </div>
                    )}
                </div>

                <h1 className="text-2xl font-semibold mb-2 tracking-tight">
                    {step === 'username' ? 'Sign in to Admin' : `Hello, ${username}`}
                </h1>

                <p className="text-gray-500 mb-10 text-[15px]">
                    {step === 'username' ? 'Enter your username to continue' : 'Enter your password'}
                </p>

                <form onSubmit={handleContinue} className="w-full space-y-5">
                    {step === 'username' ? (
                        <div className="space-y-1">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                className="w-full h-[50px] px-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none text-[17px] transition-all duration-200 placeholder:text-gray-400"
                                autoFocus
                            />
                        </div>
                    ) : (
                        <div className="space-y-1 animation-slide-up">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full h-[50px] px-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none text-[17px] transition-all duration-200 placeholder:text-gray-400"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => { setStep('username'); setPassword(''); setError(''); }}
                                className="text-sm text-blue-600 hover:underline mt-2 ml-1"
                            >
                                Not {username}?
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center font-medium animate-shake">
                            {error}
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading || (step === 'username' ? !username : !password)}
                            className={`w-full h-[50px] rounded-xl font-medium text-[17px] text-white flex items-center justify-center gap-2 transition-all duration-200
                ${loading || (step === 'username' ? !username : !password)
                                    ? 'bg-blue-300 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transform active:scale-[0.98]'
                                }`}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Continue <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-16 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-xs font-medium">
                        <span className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50">?</span>
                        <span>Protected by Admin Security</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
