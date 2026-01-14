import { Activity, Users, Key, BarChart3 } from 'lucide-react';
import { UsageLog, Customer, License } from '../types';

interface AnalyticsTabProps {
    recentUsage: UsageLog[];
    customers: Customer[];
    licenses: License[];
}

export default function AnalyticsTab({ recentUsage, customers, licenses }: AnalyticsTabProps) {
    return (
        <div className="space-y-6 animate-fade-in pb-20 lg:pb-0">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-50 rounded-xl">
                            <Activity size={20} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Total Scrapes (All Time)</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {recentUsage.reduce((sum, u) => sum + u.count, 0).toLocaleString()}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-50 rounded-xl">
                            <Users size={20} className="text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Total Customers</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-50 rounded-xl">
                            <Key size={20} className="text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Licensed vs Free</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {licenses.filter(l => l.is_active).length} / {customers.length}
                    </p>
                </div>
            </div>

            {/* Daily Usage Chart */}
            <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/30">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <BarChart3 size={18} className="text-gray-400" />
                        Daily Usage (Last 7 Days)
                    </h3>
                </div>
                <div className="p-6 overflow-x-auto">
                    <div className="flex items-end gap-2 h-48 min-w-[300px]">
                        {(() => {
                            // Group usage by date
                            const usageByDate: Record<string, number> = {};
                            recentUsage.forEach(u => {
                                usageByDate[u.date] = (usageByDate[u.date] || 0) + u.count;
                            });

                            // Get last 7 days
                            const days = [];
                            for (let i = 6; i >= 0; i--) {
                                const d = new Date();
                                d.setDate(d.getDate() - i);
                                days.push(d.toISOString().split('T')[0]);
                            }

                            const maxUsage = Math.max(...days.map(d => usageByDate[d] || 0), 1);

                            return days.map((day, i) => {
                                const usage = usageByDate[day] || 0;
                                const height = (usage / maxUsage) * 100;
                                const dayLabel = new Date(day).toLocaleDateString('id-ID', { weekday: 'short' });

                                return (
                                    <div key={day} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '160px' }}>
                                            <div
                                                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500"
                                                style={{ height: `${height}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500">{dayLabel}</span>
                                        <span className="text-xs font-semibold text-gray-700">{usage}</span>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>
            </div>

            {/* Top Customers */}
            <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/30">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Users size={18} className="text-gray-400" />
                        Top 10 Customers
                    </h3>
                </div>
                <div className="p-6 space-y-3 overflow-x-auto">
                    {customers.slice(0, 10).map((customer, i) => {
                        const maxScrapes = customers[0]?.totalScrapes || 1;
                        const width = (customer.totalScrapes / maxScrapes) * 100;

                        return (
                            <div key={i} className="flex items-center gap-4 min-w-[300px]">
                                <span className="w-6 text-sm font-bold text-gray-400">#{i + 1}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-mono text-gray-600">{customer.deviceId.substring(0, 16)}...</span>
                                        <span className="text-sm font-semibold text-gray-900">{customer.totalScrapes}</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                            style={{ width: `${width}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {customers.length === 0 && (
                        <p className="text-center text-gray-400 py-8">No customer data yet</p>
                    )}
                </div>
            </div>

            {/* Usage Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Usage Distribution</h3>
                    <div className="space-y-3">
                        {(() => {
                            const licensed = recentUsage.filter(u => u.license_id).reduce((sum, u) => sum + u.count, 0);
                            const guest = recentUsage.filter(u => !u.license_id).reduce((sum, u) => sum + u.count, 0);
                            const total = licensed + guest || 1;

                            return (
                                <>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-gray-600">Licensed Users</span>
                                            <span className="text-sm font-semibold text-green-600">{licensed.toLocaleString()}</span>
                                        </div>
                                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${(licensed / total) * 100}%` }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-gray-600">Free Users (Guest)</span>
                                            <span className="text-sm font-semibold text-gray-600">{guest.toLocaleString()}</span>
                                        </div>
                                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gray-400 rounded-full" style={{ width: `${(guest / total) * 100}%` }} />
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">License Plans</h3>
                    <div className="space-y-3">
                        {(() => {
                            const pro = licenses.filter(l => l.plan === 'pro' && l.is_active).length;
                            const enterprise = licenses.filter(l => l.plan === 'enterprise' && l.is_active).length;
                            const inactive = licenses.filter(l => !l.is_active).length;

                            return (
                                <>
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                                        <span className="text-sm font-medium text-blue-700">Pro</span>
                                        <span className="text-lg font-bold text-blue-700">{pro}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                                        <span className="text-sm font-medium text-purple-700">Enterprise</span>
                                        <span className="text-lg font-bold text-purple-700">{enterprise}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <span className="text-sm font-medium text-gray-600">Inactive</span>
                                        <span className="text-lg font-bold text-gray-600">{inactive}</span>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
}
