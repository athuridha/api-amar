'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users, Key, BarChart3, LogOut, RefreshCw,
    Search, Bell, Settings, ChevronRight, Activity,
    LayoutDashboard, CreditCard, AlertTriangle, Shield
} from 'lucide-react';

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

interface Customer {
    deviceId: string;
    ipAddress: string;
    userAgent: string;
    totalScrapes: number;
    lastActive: string;
}

interface SuspiciousActivity {
    ipAddress: string;
    date: string;
    deviceCount: number;
    deviceIds: string[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [licenses, setLicenses] = useState<License[]>([]);
    const [recentUsage, setRecentUsage] = useState<UsageLog[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [suspicious, setSuspicious] = useState<SuspiciousActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Create License State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [newLicense, setNewLicense] = useState({
        email: '',
        plan: 'pro',
        limit: 1000,
        duration: 30
    });

    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateLicense = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateLoading(true);

        try {
            const res = await fetch('/api/admin/licenses/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: newLicense.email,
                    plan: newLicense.plan,
                    limit: newLicense.limit,
                    durationDays: newLicense.duration
                }),
            });

            const data = await res.json();

            if (data.success) {
                setShowCreateModal(false);
                setNewLicense({ email: '', plan: 'pro', limit: 1000, duration: 30 });
                fetchData(); // Refresh list
                alert('License created successfully: ' + data.license.license_key);
            } else {
                alert('Error: ' + data.error);
            }
        } catch (err) {
            alert('Network error');
        }
        setCreateLoading(false);
    };

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
            setCustomers(data.customers || []);
            setSuspicious(data.suspicious || []);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleToggleStatus = async (licenseId: string, currentStatus: boolean) => {
        // Optimistic update
        setLicenses(licenses.map(l => l.id === licenseId ? { ...l, is_active: !currentStatus } : l));

        try {
            const res = await fetch('/api/admin/licenses/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: licenseId, is_active: !currentStatus }),
            });

            if (!res.ok) throw new Error('Failed to update');

            // Refresh stats to keep counts accurate
            fetchData();
        } catch (err) {
            // Revert on error
            setLicenses(licenses.map(l => l.id === licenseId ? { ...l, is_active: currentStatus } : l));
            alert('Failed to update license status');
        }
    };

    const handleLogout = () => {
        document.cookie = 'admin_auth=; Max-Age=0; path=/;';
        router.push('/admin');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#F3F4F6] font-[system-ui]">
            {/* Sidebar */}
            <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/20">
                            R
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">Rumah123</h1>
                            <p className="text-xs text-gray-500 font-medium">Scraper Admin</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        <SidebarItem
                            active={activeTab === 'overview'}
                            onClick={() => setActiveTab('overview')}
                            icon={<LayoutDashboard size={20} />}
                            label="Dashboard"
                        />
                        <SidebarItem
                            active={activeTab === 'licenses'}
                            onClick={() => setActiveTab('licenses')}
                            icon={<Key size={20} />}
                            label="Licenses"
                        />
                        <SidebarItem
                            active={activeTab === 'customers'}
                            onClick={() => setActiveTab('customers')}
                            icon={<Users size={20} />}
                            label="Customers"
                        />
                        <SidebarItem
                            active={activeTab === 'analytics'}
                            onClick={() => setActiveTab('analytics')}
                            icon={<BarChart3 size={20} />}
                            label="Analytics"
                        />
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-gray-100">
                    <SidebarItem
                        active={false}
                        onClick={() => { }}
                        icon={<Settings size={20} />}
                        label="Settings"
                    />
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-[15px] font-medium mt-1"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-[280px] p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {activeTab === 'overview' ? 'Overview' : 'License Management'}
                        </h2>
                        <p className="text-gray-500 text-[15px] mt-1">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {activeTab === 'licenses' && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 flex items-center gap-2"
                            >
                                <span className="text-lg">+</span> Create License
                            </button>
                        )}

                        <button
                            onClick={fetchData}
                            className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                            title="Refresh Data"
                        >
                            <RefreshCw size={18} />
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-md ring-2 ring-white"></div>
                            <div className="text-sm">
                                <p className="font-semibold text-gray-900">Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-fade-in">

                        {/* Main Welcome Banner */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold mb-2">Welcome back, Admin!</h3>
                                <p className="text-blue-100 max-w-xl text-lg">
                                    You have {stats?.totalScrapesToday.toLocaleString()} new scrapes today. System performance is optimal.
                                </p>
                            </div>
                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 right-20 -mb-20 w-60 h-60 bg-blue-500/20 rounded-full blur-2xl"></div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                label="Total Scrapes"
                                value={stats?.totalScrapesToday}
                                icon={<Activity className="text-blue-600" />}
                                trend="+12% from yesterday"
                            />
                            <StatCard
                                label="Active Users"
                                value={stats?.uniqueUsersToday}
                                icon={<Users className="text-indigo-600" />}
                                trend="+5% new users"
                            />
                            <StatCard
                                label="Active Licenses"
                                value={stats?.activeLicenses}
                                icon={<Key className="text-green-600" />}
                                trend="All systems operational"
                            />
                            <StatCard
                                label="Total Licenses"
                                value={stats?.totalLicenses}
                                icon={<CreditCard className="text-purple-600" />}
                                trend="+2 this month"
                            />
                        </div>

                        {/* Recent Usage Table */}
                        <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Activity size={18} className="text-gray-400" />
                                    Recent Activity
                                </h3>
                                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                                    View All <ChevronRight size={16} />
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Identifier</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Scrapes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {recentUsage.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">No activity recorded yet</td>
                                            </tr>
                                        ) : (
                                            recentUsage.map((usage) => (
                                                <tr key={usage.id} className="hover:bg-gray-50/80 transition-colors group">
                                                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(usage.date).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium border
                              ${usage.license_id
                                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                                : 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                                                            {usage.license_id ? 'License' : 'Guest'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-mono text-gray-500 group-hover:text-gray-900 transition-colors">
                                                        {(usage.license_id || usage.device_id || '-').substring(0, 16)}...
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                                                        <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">+{usage.count}</span>
                                                    </td>
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
                    <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden animate-fade-in">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Key size={18} className="text-gray-400" />
                                All Licenses
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">License Key</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Limit</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {licenses.map((license) => (
                                        <tr key={license.id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{license.email}</td>
                                            <td className="px-6 py-4">
                                                <code className="text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200 text-gray-600 font-mono">
                                                    {license.license_key}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium border capitalize
                          ${license.plan === 'enterprise'
                                                        ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                        : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                                    {license.plan}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {license.daily_limit >= 999999 ? 'Unlimited' : license.daily_limit.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleToggleStatus(license.id, license.is_active)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                            ${license.is_active ? 'bg-green-500' : 'bg-gray-200'}`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out
                            ${license.is_active ? 'translate-x-6' : 'translate-x-1'}`}
                                                    />
                                                </button>
                                                <span className={`ml-3 text-xs font-medium ${license.is_active ? 'text-green-700' : 'text-gray-500'}`}>
                                                    {license.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {activeTab === 'customers' && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Suspicious Activity Alert */}
                        {suspicious.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-red-100 rounded-xl">
                                        <AlertTriangle className="text-red-600" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-red-800">Suspicious Activity Detected</h3>
                                        <p className="text-sm text-red-600">{suspicious.length} IP addresses using multiple device IDs</p>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-red-200">
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-red-700">IP Address</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-red-700">Date</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-red-700">Device Count</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-red-700">Device IDs</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {suspicious.slice(0, 10).map((item, i) => (
                                                <tr key={i} className="border-b border-red-100">
                                                    <td className="px-4 py-2 font-mono text-red-800">{item.ipAddress}</td>
                                                    <td className="px-4 py-2 text-red-700">{item.date}</td>
                                                    <td className="px-4 py-2">
                                                        <span className="bg-red-200 text-red-800 px-2 py-0.5 rounded font-bold">{item.deviceCount}</span>
                                                    </td>
                                                    <td className="px-4 py-2 font-mono text-xs text-red-600">
                                                        {item.deviceIds.map(id => id.substring(0, 12)).join(', ')}...
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* All Customers Table */}
                        <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Users size={18} className="text-gray-400" />
                                    All Customers ({customers.length})
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Device ID</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">IP Address</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">User Agent</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Total Scrapes</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Last Active</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {customers.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No customer data yet</td>
                                            </tr>
                                        ) : (
                                            customers.map((customer, i) => (
                                                <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                                                    <td className="px-6 py-4 font-mono text-sm text-gray-600">{customer.deviceId.substring(0, 20)}...</td>
                                                    <td className="px-6 py-4 font-mono text-sm text-gray-500">{customer.ipAddress}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-400 max-w-[200px] truncate" title={customer.userAgent}>
                                                        {customer.userAgent.substring(0, 30)}...
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-semibold">{customer.totalScrapes}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">{customer.lastActive}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden animate-fade-in">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <BarChart3 size={18} className="text-gray-400" />
                                Advanced Analytics
                            </h3>
                        </div>
                        <div className="p-8 text-center text-gray-500">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BarChart3 size={32} className="text-gray-300" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Analytics Dashboard</h3>
                            <p className="mt-1">Charts and historical trends will be displayed here.</p>
                        </div>
                    </div>
                )}
            </main>

            {/* Create License Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 transform transition-all scale-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Create New License</h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <span className="text-2xl">×</span>
                            </button>
                        </div>

                        <form onSubmit={handleCreateLicense} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-1">User Email</label>
                                <input
                                    type="email"
                                    required
                                    value={newLicense.email}
                                    onChange={(e) => setNewLicense({ ...newLicense, email: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400"
                                    placeholder="user@example.com"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-1">Plan Type</label>
                                    <select
                                        value={newLicense.plan}
                                        onChange={(e) => setNewLicense({ ...newLicense, plan: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
                                    >
                                        <option value="pro">Pro</option>
                                        <option value="enterprise">Enterprise</option>
                                    </select>
                                </div>
                                <div>
                                    <div>
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="block text-sm font-bold text-gray-900">Daily Limit</label>
                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <span className="text-xs font-medium text-gray-500 group-hover:text-blue-600 transition-colors">Unlimited</span>
                                                    <input
                                                        type="checkbox"
                                                        checked={newLicense.limit >= 999999}
                                                        onChange={(e) => setNewLicense({ ...newLicense, limit: e.target.checked ? 1000000 : 1000 })}
                                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                                    />
                                                </label>
                                            </div>
                                            <input
                                                type="number"
                                                disabled={newLicense.limit >= 999999}
                                                value={newLicense.limit >= 999999 ? '' : newLicense.limit}
                                                onChange={(e) => setNewLicense({ ...newLicense, limit: parseInt(e.target.value) || 0 })}
                                                className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${newLicense.limit >= 999999
                                                    ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed placeholder:text-gray-400'
                                                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-400'
                                                    }`}
                                                placeholder={newLicense.limit >= 999999 ? "Unlimited" : "e.g. 1000"}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-1">Duration (Days)</label>
                                <input
                                    type="number"
                                    value={newLicense.duration}
                                    onChange={(e) => setNewLicense({ ...newLicense, duration: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    placeholder="30"
                                />
                                <p className="text-xs text-gray-500 mt-1">Leave 0 for no expiration</p>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createLoading}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    {createLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create License'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function SidebarItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                ${active
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
                }`}
        >
            <div className="flex items-center gap-3">
                <span className={`${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                    {icon}
                </span>
                <span className="text-[15px]">{label}</span>
            </div>
            {active && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>}
        </button>
    )
}

function StatCard({ label, value, icon, trend }: { label: string, value: number | undefined, icon: React.ReactNode, trend: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                    {icon}
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{trend}</span>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value?.toLocaleString() || 0}</h3>
            </div>
        </div>
    );
}
