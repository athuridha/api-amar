'use client';

import { Activity, Users, Key, CreditCard, ChevronRight } from 'lucide-react';
import StatCard from './StatCard';

interface OverviewTabProps {
    stats: {
        totalLicenses: number;
        activeLicenses: number;
        totalScrapesToday: number;
        uniqueUsersToday: number;
        date: string;
    } | null;
    recentUsage: {
        id: string;
        license_id: string | null;
        device_id: string | null;
        date: string;
        count: number;
    }[];
}

export default function OverviewTab({ stats, recentUsage }: OverviewTabProps) {
    return (
        <div className="space-y-6 animate-fade-in pb-20 lg:pb-0">

            {/* Main Welcome Banner */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-5 lg:p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-xl lg:text-3xl font-bold mb-2 tracking-tight">Welcome, Admin!</h3>
                    <p className="text-blue-100 max-w-xl text-xs lg:text-lg mb-4 lg:mb-6 leading-relaxed">
                        Monitor usage and manage licenses.
                    </p>
                    <button className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-xl font-semibold text-white transition-all flex items-center gap-2 text-xs lg:text-base">
                        <span>Documentation</span>
                        <ChevronRight size={16} />
                    </button>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-10 -mb-10 w-40 h-40 bg-indigo-500/30 rounded-full blur-2xl"></div>
            </div>

            {/* Stats Grid - 2 Col Mobile */}
            <div className="grid grid-cols-2 ml-1 mr-1 lg:mx-0 lg:grid-cols-4 gap-3 lg:gap-6">
                <StatCard
                    label="Total Scrapes"
                    value={stats?.totalScrapesToday}
                    icon={<Activity size={24} className="text-white" />}
                    trend="+12%"
                    color="bg-blue-500"
                />
                <StatCard
                    label="Active Users"
                    value={stats?.uniqueUsersToday}
                    icon={<Users size={24} className="text-white" />}
                    trend="+5%"
                    color="bg-indigo-500"
                />
                <StatCard
                    label="Active Licenses"
                    value={stats?.activeLicenses}
                    icon={<Key size={24} className="text-white" />}
                    trend="Stable"
                    color="bg-emerald-500"
                />
                <StatCard
                    label="Total Licenses"
                    value={stats?.totalLicenses}
                    icon={<CreditCard size={24} className="text-white" />}
                    trend="+2"
                    color="bg-violet-500"
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

                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Identifier</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Scrapes</th>
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
                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{new Date(usage.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium border
                                                ${usage.license_id
                                                    ? 'bg-green-50 text-green-700 border-green-100'
                                                    : 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                                                {usage.license_id ? 'License' : 'Guest'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-gray-500 group-hover:text-gray-900 transition-colors whitespace-nowrap">
                                            {(usage.license_id || usage.device_id || '-').substring(0, 16)}...
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right whitespace-nowrap">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">+{usage.count}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View - Compact List */}
                <div className="md:hidden divide-y divide-gray-100">
                    {recentUsage.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">No activity recorded yet</div>
                    ) : (
                        recentUsage.map((usage) => (
                            <div key={usage.id} className="p-3 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${usage.license_id ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-gray-900 truncate max-w-[120px]">
                                                {(usage.license_id || usage.device_id || '-').substring(0, 8)}...
                                            </span>
                                            <span className="text-[10px] text-gray-400">
                                                {new Date(usage.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-gray-500 truncate">
                                            {usage.license_id ? 'Licensed User' : 'Guest User'}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md flex-shrink-0">
                                    +{usage.count}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
