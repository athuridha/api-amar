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
    const [error, setError] = useState('');
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
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div style={styles.loading}>
                <div>Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.error}>
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => router.push('/admin')} style={styles.button}>
                    Back to Login
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1>Admin Dashboard</h1>
                <p>Rumah123 Scraper Analytics</p>
            </header>

            {/* Stats Grid */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{stats?.totalScrapesToday || 0}</div>
                    <div style={styles.statLabel}>Scrapes Hari Ini</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{stats?.uniqueUsersToday || 0}</div>
                    <div style={styles.statLabel}>User Aktif Hari Ini</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{stats?.activeLicenses || 0}</div>
                    <div style={styles.statLabel}>License Aktif</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{stats?.totalLicenses || 0}</div>
                    <div style={styles.statLabel}>Total License</div>
                </div>
            </div>

            {/* Licenses Table */}
            <div style={styles.section}>
                <h2>Licenses</h2>
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>License Key</th>
                                <th>Plan</th>
                                <th>Daily Limit</th>
                                <th>Status</th>
                                <th>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {licenses.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                                        No licenses yet
                                    </td>
                                </tr>
                            ) : (
                                licenses.map((license) => (
                                    <tr key={license.id}>
                                        <td>{license.email}</td>
                                        <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                                            {license.license_key.substring(0, 20)}...
                                        </td>
                                        <td>
                                            <span style={{
                                                ...styles.badge,
                                                background: license.plan === 'enterprise' ? '#805ad5' : '#38a169'
                                            }}>
                                                {license.plan.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>{license.daily_limit >= 999999 ? 'Unlimited' : license.daily_limit}</td>
                                        <td>
                                            <span style={{
                                                ...styles.badge,
                                                background: license.is_active ? '#38a169' : '#e53e3e'
                                            }}>
                                                {license.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>{new Date(license.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Usage */}
            <div style={styles.section}>
                <h2>Recent Usage</h2>
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>ID</th>
                                <th>Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUsage.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                                        No usage data yet
                                    </td>
                                </tr>
                            ) : (
                                recentUsage.map((usage) => (
                                    <tr key={usage.id}>
                                        <td>{usage.date}</td>
                                        <td>
                                            <span style={{
                                                ...styles.badge,
                                                background: usage.license_id ? '#38a169' : '#718096'
                                            }}>
                                                {usage.license_id ? 'Licensed' : 'Guest'}
                                            </span>
                                        </td>
                                        <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                                            {(usage.license_id || usage.device_id || '-').substring(0, 16)}...
                                        </td>
                                        <td><strong>{usage.count}</strong></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <footer style={styles.footer}>
                <button onClick={fetchData} style={styles.refreshButton}>
                    Refresh Data
                </button>
            </footer>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: '100vh',
        background: '#f7fafc',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
        padding: '24px'
    },
    header: {
        marginBottom: '32px',
        textAlign: 'center'
    },
    loading: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px'
    },
    error: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
    },
    statCard: {
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textAlign: 'center'
    },
    statValue: {
        fontSize: '36px',
        fontWeight: 700,
        color: '#c41e3a',
        marginBottom: '4px'
    },
    statLabel: {
        fontSize: '14px',
        color: '#718096'
    },
    section: {
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    tableContainer: {
        overflowX: 'auto'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px'
    },
    badge: {
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '11px',
        fontWeight: 600
    },
    button: {
        padding: '12px 24px',
        background: '#c41e3a',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 600
    },
    refreshButton: {
        padding: '12px 24px',
        background: '#2c5282',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 600
    },
    footer: {
        textAlign: 'center',
        marginTop: '24px'
    }
};
