'use client';

import { RefreshCw } from 'lucide-react';

interface HeaderProps {
    activeTab: string;
    onRefresh: () => void;
    onCreateLicense?: () => void;
}

export default function Header({ activeTab, onRefresh, onCreateLicense }: HeaderProps) {
    const getTitle = () => {
        switch (activeTab) {
            case 'licenses': return 'License Management';
            case 'customers': return 'Customer Activity';
            case 'analytics': return 'System Analytics';
            default: return 'Overview';
        }
    };

    return (
        <header className="hidden lg:flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{getTitle()}</h2>
                <p className="text-gray-500 text-[15px] mt-1">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>
            <div className="flex items-center gap-3">
                {activeTab === 'licenses' && onCreateLicense && (
                    <button
                        onClick={onCreateLicense}
                        className="px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 flex items-center gap-2"
                    >
                        <span className="text-lg">+</span>
                        <span className="hidden sm:inline">Create</span> License
                    </button>
                )}

                <button
                    onClick={onRefresh}
                    className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                    title="Refresh Data"
                >
                    <RefreshCw size={18} />
                </button>

                <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-md ring-2 ring-white"></div>
                    <div className="text-sm">
                        <p className="font-semibold text-gray-900">Admin</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
