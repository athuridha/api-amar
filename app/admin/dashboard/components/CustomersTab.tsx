'use client';

import { Users, AlertTriangle } from 'lucide-react';

interface SuspiciousActivity {
    ipAddress: string;
    date: string;
    deviceCount: number;
    deviceIds: string[];
}

interface Customer {
    deviceId: string;
    ipAddress: string;
    userAgent: string;
    totalScrapes: number;
    lastActive: string;
}

interface CustomersTabProps {
    customers: Customer[];
    suspicious: SuspiciousActivity[];
}

export default function CustomersTab({ customers, suspicious }: CustomersTabProps) {
    return (
        <div className="space-y-6 animate-fade-in pb-20 lg:pb-0">
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
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-red-700 whitespace-nowrap">IP Address</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-red-700 whitespace-nowrap">Date</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-red-700 whitespace-nowrap">Device Count</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-red-700 whitespace-nowrap">Device IDs</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suspicious.slice(0, 10).map((item, i) => (
                                    <tr key={i} className="border-b border-red-100">
                                        <td className="px-4 py-2 font-mono text-red-800 whitespace-nowrap">{item.ipAddress}</td>
                                        <td className="px-4 py-2 text-red-700 whitespace-nowrap">{item.date}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            <span className="bg-red-200 text-red-800 px-2 py-0.5 rounded font-bold">{item.deviceCount}</span>
                                        </td>
                                        <td className="px-4 py-2 font-mono text-xs text-red-600 whitespace-nowrap">
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


                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Device ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">IP Address</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">User Agent</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Total Scrapes</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Last Active</th>
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
                                        <td className="px-6 py-4 font-mono text-sm text-gray-600 whitespace-nowrap">{customer.deviceId.substring(0, 20)}...</td>
                                        <td className="px-6 py-4 font-mono text-sm text-gray-500 whitespace-nowrap">{customer.ipAddress}</td>
                                        <td className="px-6 py-4 text-sm text-gray-400 max-w-[200px] truncate" title={customer.userAgent}>
                                            {customer.userAgent.substring(0, 30)}...
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-semibold">{customer.totalScrapes}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{customer.lastActive}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View - Compact */}
                <div className="md:hidden divide-y divide-gray-100">
                    {customers.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">No customer data yet</div>
                    ) : (
                        customers.map((customer, i) => (
                            <div key={i} className="p-3 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                <div className="min-w-0 pr-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="font-mono text-xs font-semibold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                                            {customer.deviceId.substring(0, 8)}...
                                        </div>
                                        <div className="text-[10px] text-gray-400">{customer.ipAddress}</div>
                                    </div>
                                    <div className="text-[10px] text-gray-500 truncate max-w-[180px]">
                                        {customer.userAgent}
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <span className="block text-sm font-bold text-blue-700">
                                        {customer.totalScrapes}
                                    </span>
                                    <span className="text-[10px] text-gray-400 block">
                                        scrapes
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
