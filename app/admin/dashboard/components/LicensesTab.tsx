'use client';

import { Key } from 'lucide-react';

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

interface LicensesTabProps {
    licenses: License[];
    onToggleStatus: (id: string, currentStatus: boolean) => void;
}

export default function LicensesTab({ licenses, onToggleStatus }: LicensesTabProps) {
    return (

        <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden animate-fade-in mb-20 lg:mb-0">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Key size={18} className="text-gray-400" />
                    All Licenses
                </h3>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">License Key</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Plan</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Limit</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {licenses.map((license) => (
                            <tr key={license.id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">{license.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200 text-gray-600 font-mono">
                                        {license.license_key}
                                    </code>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium border capitalize
                                        ${license.plan === 'enterprise'
                                            ? 'bg-purple-50 text-purple-700 border-purple-100'
                                            : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                        {license.plan}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                    {license.daily_limit >= 999999 ? 'Unlimited' : license.daily_limit.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => onToggleStatus(license.id, license.is_active)}
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

            {/* Mobile Card View - Compact */}
            <div className="md:hidden divide-y divide-gray-100">
                {licenses.map((license) => (
                    <div key={license.id} className="p-3 hover:bg-gray-50 transition-colors flex items-center justify-between">
                        <div className="min-w-0 flex-1 pr-3">
                            <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-sm font-semibold text-gray-900 truncate">{license.email}</p>
                                <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold border capitalize flex-shrink-0
                                    ${license.plan === 'enterprise'
                                        ? 'bg-purple-50 text-purple-700 border-purple-100'
                                        : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                    {license.plan}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <code className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-gray-500 font-mono">
                                    {license.license_key.substring(0, 8)}...
                                </code>
                                <span>•</span>
                                <span>{license.daily_limit >= 999999 ? '∞' : license.daily_limit} reqs</span>
                            </div>
                        </div>

                        <button
                            onClick={() => onToggleStatus(license.id, license.is_active)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none flex-shrink-0
                                ${license.is_active ? 'bg-green-500' : 'bg-gray-200'}`}
                        >
                            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ease-in-out
                                ${license.is_active ? 'translate-x-5' : 'translate-x-1'}`}
                            />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}