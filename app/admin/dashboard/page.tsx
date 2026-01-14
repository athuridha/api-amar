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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f3f4f6', fontFamily: 'Inter, sans-serif' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: '#1f2937',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100%',
                zIndex: 10
            }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #374151' }}>
                    <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ background: '#c41e3a', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>R</span>
                        Rumah123
                    </h1>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Admin Dashboard</p>
                </div>

                <nav style={{ flex: 1, padding: '24px 16px' }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li>
                            <button
                                onClick={() => setActiveTab('overview')}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    background: activeTab === 'overview' ? '#374151' : 'transparent',
                                    color: activeTab === 'overview' ? 'white' : '#d1d5db',
                                    border: 'none',
                                    cursor: 'pointer',
                                    marginBottom: '8px',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                            >
                                <span>📊</span> Overview
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('licenses')}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    background: activeTab === 'licenses' ? '#374151' : 'transparent',
                                    color: activeTab === 'licenses' ? 'white' : '#d1d5db',
                                    border: 'none',
                                    cursor: 'pointer',
                                    marginBottom: '8px',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                            >
                                <span>🔑</span> Licenses
                            </button>
                        </li>
                    </ul>
                </nav>

                <div style={{ padding: '24px', borderTop: '1px solid #374151' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'transparent',
                            border: '1px solid #4b5563',
                            color: '#d1d5db',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#374151'; e.currentTarget.style.color = 'white'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d1d5db'; }}
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, marginLeft: '260px', padding: '32px' }}>
                <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                            {activeTab === 'overview' ? 'Dashboard Overview' : 'License Management'}
                        </h2>
                        <p style={{ color: '#6b7280', fontSize: '14px' }}>Welcome back, Admin</p>
                    </div>
                    <button
                        onClick={fetchData}
                        style={{
                            padding: '10px 20px',
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            color: '#374151',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 500,
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        Refresh Data
                    </button>
                </header>

                {activeTab === 'overview' && (
                    <>
                        {/* Stats Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                            <div style={cardStyle}>
                                <p style={cardLabelStyle}>Total Scrapes Today</p>
                                <div style={cardValueStyle}>{stats?.totalScrapesToday.toLocaleString() || 0}</div>
                                <div style={cardTrendStyle}>Updated just now</div>
                            </div>
                            <div style={cardStyle}>
                                <p style={cardLabelStyle}>Active Users Today</p>
                                <div style={cardValueStyle}>{stats?.uniqueUsersToday.toLocaleString() || 0}</div>
                                <div style={cardTrendStyle}>Unique devices/licenses</div>
                            </div>
                            <div style={cardStyle}>
                                <p style={cardLabelStyle}>Active Licenses</p>
                                <div style={cardValueStyle}>{stats?.activeLicenses.toLocaleString() || 0}</div>
                                <div style={{ ...cardTrendStyle, color: '#059669' }}>Pro & Enterprise</div>
                            </div>
                            <div style={cardStyle}>
                                <p style={cardLabelStyle}>Total Licenses</p>
                                <div style={cardValueStyle}>{stats?.totalLicenses.toLocaleString() || 0}</div>
                                <div style={cardTrendStyle}>All time</div>
                            </div>
                        </div>

                        {/* Recent Usage Table */}
                        <div style={sectionStyle}>
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>Recent Activity</h3>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ background: '#f9fafb' }}>
                                        <tr>
                                            <th style={thStyle}>Date & Time</th>
                                            <th style={thStyle}>User Type</th>
                                            <th style={thStyle}>Identifier</th>
                                            <th style={thStyle}>Scrapes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentUsage.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No recent activity</td>
                                            </tr>
                                        ) : (
                                            recentUsage.map((usage, i) => (
                                                <tr key={usage.id} style={{ borderBottom: i !== recentUsage.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                                    <td style={tdStyle}>{new Date(usage.date).toLocaleDateString()}</td>
                                                    <td style={tdStyle}>
                                                        <span style={{
                                                            padding: '2px 10px',
                                                            borderRadius: '9999px',
                                                            fontSize: '12px',
                                                            fontWeight: 500,
                                                            background: usage.license_id ? '#ecfdf5' : '#f3f4f6',
                                                            color: usage.license_id ? '#059669' : '#4b5563'
                                                        }}>
                                                            {usage.license_id ? 'License' : 'Guest'}
                                                        </span>
                                                    </td>
                                                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '12px', color: '#111827' }}>
                                                        {(usage.license_id || usage.device_id || '-').substring(0, 20)}...
                                                    </td>
                                                    <td style={{ ...tdStyle, fontWeight: 600 }}>+{usage.count}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'licenses' && (
                    <div style={sectionStyle}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>All Licenses</h3>
                            {/* Future: Add Create License button here */}
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#f9fafb' }}>
                                    <tr>
                                        <th style={thStyle}>Email</th>
                                        <th style={thStyle}>License Key</th>
                                        <th style={thStyle}>Plan</th>
                                        <th style={thStyle}>Limit</th>
                                        <th style={thStyle}>Status</th>
                                        <th style={thStyle}>Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {licenses.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>No licenses found</td>
                                        </tr>
                                    ) : (
                                        licenses.map((license, i) => (
                                            <tr key={license.id} style={{ borderBottom: i !== licenses.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                                <td style={tdStyle}>{license.email}</td>
                                                <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '12px', color: '#111827' }}>
                                                    {license.license_key}
                                                </td>
                                                <td style={tdStyle}>
                                                    <span style={{
                                                        padding: '2px 10px',
                                                        borderRadius: '9999px',
                                                        fontSize: '12px',
                                                        fontWeight: 500,
                                                        background: license.plan === 'enterprise' ? '#f5f3ff' : '#ecfdf5',
                                                        color: license.plan === 'enterprise' ? '#7c3aed' : '#059669',
                                                        textTransform: 'capitalize'
                                                    }}>
                                                        {license.plan}
                                                    </span>
                                                </td>
                                                <td style={tdStyle}>{license.daily_limit >= 999999 ? 'Unlimited' : license.daily_limit.toLocaleString()}</td>
                                                <td style={tdStyle}>
                                                    <span style={{
                                                        padding: '2px 10px',
                                                        borderRadius: '9999px',
                                                        fontSize: '12px',
                                                        fontWeight: 500,
                                                        background: license.is_active ? '#ecfdf5' : '#fef2f2',
                                                        color: license.is_active ? '#059669' : '#dc2626'
                                                    }}>
                                                        {license.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td style={{ ...tdStyle, color: '#6b7280' }}>{new Date(license.created_at).toLocaleDateString()}</td>
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

// Styles
const cardStyle: React.CSSProperties = {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    border: '1px solid #e5e7eb'
};

const cardLabelStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px',
    fontWeight: 500
};

const cardValueStyle: React.CSSProperties = {
    fontSize: '30px',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '4px'
};

const cardTrendStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#9ca3af'
};

const sectionStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden'
};

const thStyle: React.CSSProperties = {
    padding: '12px 24px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const tdStyle: React.CSSProperties = {
    padding: '16px 24px',
    fontSize: '14px',
    color: '#374151',
    verticalAlign: 'middle'
};
