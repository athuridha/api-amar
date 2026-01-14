'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Sidebar, Header, OverviewTab, LicensesTab,
    CustomersTab, AnalyticsTab, CreateLicenseModal
} from './components';
import { Stats, License, UsageLog, Customer, SuspiciousActivity } from './types';

export default function AdminDashboard() {
    // Data State
    const [stats, setStats] = useState<Stats | null>(null);
    const [licenses, setLicenses] = useState<License[]>([]);
    const [recentUsage, setRecentUsage] = useState<UsageLog[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [suspicious, setSuspicious] = useState<SuspiciousActivity[]>([]);

    // UI State
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    const router = useRouter();

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

    useEffect(() => {
        fetchData();

        // Setup realtime subscription
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
            import('@supabase/supabase-js').then(({ createClient }) => {
                const supabase = createClient(supabaseUrl, supabaseKey);

                const channel = supabase
                    .channel('usage_changes')
                    .on('postgres_changes',
                        { event: '*', schema: 'public', table: 'usage_logs' },
                        (payload) => {
                            console.log('[Realtime] Usage updated:', payload);
                            setLastUpdate(new Date());
                            fetchData(); // Refresh data on any change
                        }
                    )
                    .subscribe((status) => {
                        console.log('[Realtime] Subscription status:', status);
                    });

                return () => {
                    supabase.removeChannel(channel);
                };
            });
        } else {
            // Fallback: polling every 10 seconds if realtime not configured
            const interval = setInterval(() => {
                fetchData();
                setLastUpdate(new Date());
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [router]);

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
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            <main className="flex-1 lg:ml-[280px] p-4 lg:p-8 pt-24 lg:pt-8">
                <Header
                    activeTab={activeTab}
                    onRefresh={fetchData}
                    onCreateLicense={() => setShowCreateModal(true)}
                />

                {activeTab === 'overview' && (
                    <OverviewTab stats={stats} recentUsage={recentUsage} />
                )}

                {activeTab === 'licenses' && (
                    <LicensesTab licenses={licenses} onToggleStatus={handleToggleStatus} />
                )}

                {activeTab === 'customers' && (
                    <CustomersTab customers={customers} suspicious={suspicious} />
                )}

                {activeTab === 'analytics' && (
                    <AnalyticsTab recentUsage={recentUsage} customers={customers} licenses={licenses} />
                )}
            </main>

            <CreateLicenseModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={fetchData}
            />
        </div>
    );
}
