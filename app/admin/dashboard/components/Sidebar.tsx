'use client';

import { LayoutDashboard, Key, Users, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
    onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen, onLogout }: SidebarProps) {
    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        setMobileMenuOpen(false);
    };

    return (
        <>
            {/* Mobile Header Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100/80 z-30 flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                        <Menu size={24} strokeWidth={2.5} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Drawer */}
            <aside className={`
                w-[280px] bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 z-50
                transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                <div className="p-6">
                    {/* Header with Close Button for Mobile */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/20">
                                R
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">Rumah123</h1>
                                <p className="text-xs text-gray-500 font-medium">Scraper Admin</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="space-y-1">
                        <NavItem active={activeTab === 'overview'} onClick={() => handleTabClick('overview')} icon={<LayoutDashboard size={20} />} label="Dashboard" />
                        <NavItem active={activeTab === 'licenses'} onClick={() => handleTabClick('licenses')} icon={<Key size={20} />} label="Licenses" />
                        <NavItem active={activeTab === 'customers'} onClick={() => handleTabClick('customers')} icon={<Users size={20} />} label="Customers" />
                        <NavItem active={activeTab === 'analytics'} onClick={() => handleTabClick('analytics')} icon={<BarChart3 size={20} />} label="Analytics" />
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-gray-100">
                    <NavItem active={false} onClick={() => { }} icon={<Settings size={20} />} label="Settings" />
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-[15px] font-medium mt-1"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

function NavItem({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
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
    );
}
