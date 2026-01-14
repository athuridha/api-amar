'use client';

import { useState } from 'react';
import { Key, CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface LicenseInfo {
    valid: boolean;
    plan?: string;
    limit?: number;
    usage?: number;
    remaining?: number;
    expiresAt?: string;
    error?: string;
}

export default function CustomerPortal() {
    const [licenseKey, setLicenseKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<LicenseInfo | null>(null);

    const checkLicense = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!licenseKey.trim()) return;

        setLoading(true);
        setResult(null);

        try {
            const res = await fetch('/api/license/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ licenseKey: licenseKey.trim() })
            });

            const data = await res.json();
            setResult(data);
        } catch (err) {
            setResult({ valid: false, error: 'Network error. Please try again.' });
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-4 font-[system-ui]">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-blue-600/20">
                        R
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Rumah123 Scraper</h1>
                    <p className="text-gray-500 mt-1">Check your license status</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <form onSubmit={checkLicense} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">License Key</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={licenseKey}
                                    onChange={(e) => setLicenseKey(e.target.value)}
                                    placeholder="Enter your license key..."
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-[15px] transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !licenseKey.trim()}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                'Check License'
                            )}
                        </button>
                    </form>

                    {/* Result */}
                    {result && (
                        <div className={`mt-6 p-4 rounded-xl ${result.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                            <div className="flex items-center gap-3 mb-3">
                                {result.valid ? (
                                    <CheckCircle className="text-green-600" size={24} />
                                ) : (
                                    <XCircle className="text-red-600" size={24} />
                                )}
                                <h3 className={`font-semibold ${result.valid ? 'text-green-800' : 'text-red-800'}`}>
                                    {result.valid ? 'License Valid' : 'License Invalid'}
                                </h3>
                            </div>

                            {result.valid ? (
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Plan</span>
                                        <span className="font-semibold text-gray-900 uppercase">{result.plan}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Daily Limit</span>
                                        <span className="font-semibold text-gray-900">
                                            {result.limit && result.limit >= 999999 ? 'Unlimited' : result.limit?.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Used Today</span>
                                        <span className="font-semibold text-gray-900">{result.usage?.toLocaleString() || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Remaining</span>
                                        <span className="font-semibold text-green-600">
                                            {result.limit && result.limit >= 999999 ? 'Unlimited' : result.remaining?.toLocaleString()}
                                        </span>
                                    </div>
                                    {result.expiresAt && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Expires</span>
                                            <span className="font-semibold text-gray-900">
                                                {new Date(result.expiresAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-red-600">{result.error || 'This license key is not valid or has expired.'}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                        Don't have a license? <a href="mailto:support@example.com" className="text-blue-600 hover:underline">Contact us</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
