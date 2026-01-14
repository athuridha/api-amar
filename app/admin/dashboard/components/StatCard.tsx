'use client';

interface StatCardProps {
    label: string;
    value: number | undefined;
    icon: React.ReactNode;
    trend: string;
    color?: string;
}

export default function StatCard({ label, value, icon, trend, color = 'bg-blue-600' }: StatCardProps) {
    return (
        <div className="bg-white p-5 lg:p-6 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-lg transition-all duration-300 group">
            <div className="flex flex-col gap-4">
                <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight mb-1">{value?.toLocaleString() || 0}</h3>
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-500">{label}</p>
                        {/* <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{trend}</span> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
