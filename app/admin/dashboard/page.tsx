'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Stats {
    totalLicenses: number;
    activeLicenses: number;
    totalScrapesToday: number;
    uniqueUsersToday: number;
    date: string;
}

interface License {
    id: string;
    license_key: string;
    email: string;
    plan: string;
    daily_limit: number;
    is_active: boolean;
    created_at: string;
    expires_at: string | null;
}

interface UsageLog {
    id: string;
    license_id: string | null;
    device_id: string | null;
    date: string;
    count: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [licenses, setLicenses] = useState<License[]>([]);
    const [recentUsage, setRecentUsage] = useState<UsageLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    router.push('/admin');
                    return;
                }
                throw new Error(data.error);
            }

            setStats(data.stats);
            setLicenses(data.licenses);
            setRecentUsage(data.recentUsage);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleLogout = () => {
        document.cookie = 'admin_auth=; Max-Age=0; path=/;';
        router.push('/admin');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-[#1a1f37] text-white flex flex-col fixed h-full z-10 shadow-2xl">
                <div className="p-8 border-b border-gray-700/50">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="bg-red-600 w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg shadow-red-900/50">R</span>
                        Scraper API
                    </h1>
                    <p className="text-xs text-gray-400 mt-2 font-medium tracking-wide uppercase">Admin Dashboard</p>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`w-full text-left px-5 py-3.5 rounded-xl transition-all duration-200 flex items-center gap-4 font-medium ${activeTab === 'overview'
                                ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        <span>📊</span> Overview
                    </button>

                    <button
                        onClick={() => setActiveTab('licenses')}
                        className={`w-full text-left px-5 py-3.5 rounded-xl transition-all duration-200 flex items-center gap-4 font-medium ${activeTab === 'licenses'
                                ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        <span>🔑</span> Licenses
                    </button>
                </nav>

                <div className="p-6 border-t border-gray-700/50">
                    <button
                        onClick={handleLogout}
                        className="w-full py-3 px-4 bg-gray-800/50 border border-gray-700 text-gray-300 rounded-xl hover:bg-red-900/20 hover:text-red-400 hover:border-red-900/50 transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2 group"
                    >
                        <span className="group-hover:rotate-180 transition-transform duration-300">➜</span>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 p-10">
                <header className="mb-10 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {activeTab === 'overview' ? 'Dashboard Overview' : 'License Management'}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Welcome back, Admin</p>
                    </div>
                    <button
                        onClick={fetchData}
                        className="px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200 text-sm font-semibold flex items-center gap-2"
                    >
                        🔄 Refresh Data
                    </button>
                </header>

                {activeTab === 'overview' && (
                    <div className="animate-fade-in">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard label="Scrapes Today" value={stats?.totalScrapesToday} color="red" />
                            <StatCard label="Active Users" value={stats?.uniqueUsersToday} color="blue" />
                            <StatCard label="Active Licenses" value={stats?.activeLicenses} color="green" />
                            <StatCard label="Total Licenses" value={stats?.totalLicenses} color="purple" />
                        </div>

                        {/* Recent Usage Table */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                                            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User Type</th>
                                            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Identifier</th>
                                            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Scrapes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {recentUsage.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-10 text-center text-gray-500">No recent activity</td>
                                            </tr>
                                        ) : (
                                            recentUsage.map((usage) => (
                                                <tr key={usage.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-8 py-4 text-sm text-gray-600 font-medium">
                                                        {new Date(usage.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-8 py-4">
                                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold
                              ${usage.license_id
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-gray-100 text-gray-600'}`}>
                                                            {usage.license_id ? 'License' : 'Guest'}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-4 text-sm font-mono text-gray-500">
                                                        {(usage.license_id || usage.device_id || '-').substring(0, 16)}...
                                                    </td>
                                                    <td className="px-8 py-4 text-sm font-bold text-gray-900">+{usage.count}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'licenses' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">All Licenses</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">License Key</th>
                                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Limit</th>
                                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {licenses.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-10 text-center text-gray-500">No licenses found</td>
                                        </tr>
                                    ) : (
                                        licenses.map((license) => (
                                            <tr key={license.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-4 text-sm text-gray-900 font-medium">{license.email}</td>
                                                <td className="px-8 py-4 text-xs font-mono text-gray-500 bg-gray-50 inline-block rounded border border-gray-200 px-2 py-1 mt-3 mx-6">
                                                    {license.license_key}
                                                </td>
                                                <td className="px-8 py-4">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                            ${license.plan === 'enterprise'
                                                            ? 'bg-purple-100 text-purple-700'
                                                            : 'bg-green-100 text-green-700'}`}>
                                                        {license.plan}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4 text-sm text-gray-700 font-medium">
                                                    {license.daily_limit >= 999999 ? 'Unlimited' : license.daily_limit.toLocaleString()}
                                                </td>
                                                <td className="px-8 py-4">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold
                            ${license.is_active
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'}`}>
                                                        {license.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4 text-sm text-gray-500">
                                                    {new Date(license.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

function StatCard({ label, value, color }: { label: string, value: number | undefined, color: string }) {
    const colors: { [key: string]: string } = {
        red: 'bg-red-50 text-red-600',
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">{label}</p>
            <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-gray-900">{value?.toLocaleString() || 0}</div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>
                    <span className="text-lg">📈</span>
                </div>
            </div>
        </div>
    );
}
