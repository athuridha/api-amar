'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface CreateLicenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateLicenseModal({ isOpen, onClose, onSuccess }: CreateLicenseModalProps) {
    const [loading, setLoading] = useState(false);
    const [newLicense, setNewLicense] = useState({
        email: '',
        plan: 'pro',
        limit: 1000,
        duration: 30
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/admin/licenses/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: newLicense.email,
                    plan: newLicense.plan,
                    limit: newLicense.limit,
                    durationDays: newLicense.duration
                }),
            });

            const data = await res.json();

            if (data.success) {
                setNewLicense({ email: '', plan: 'pro', limit: 1000, duration: 30 });
                alert('License created successfully: ' + data.license.license_key);
                onSuccess();
                onClose();
            } else {
                alert('Error: ' + data.error);
            }
        } catch (err) {
            alert('Network error');
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 transform transition-all scale-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Create New License</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">User Email</label>
                        <input
                            type="email"
                            required
                            value={newLicense.email}
                            onChange={(e) => setNewLicense({ ...newLicense, email: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400"
                            placeholder="user@example.com"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-1">Plan Type</label>
                            <select
                                value={newLicense.plan}
                                onChange={(e) => setNewLicense({ ...newLicense, plan: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
                            >
                                <option value="pro">Pro</option>
                                <option value="enterprise">Enterprise</option>
                            </select>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-bold text-gray-900">Daily Limit</label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <span className="text-xs font-medium text-gray-500 group-hover:text-blue-600 transition-colors">Unlimited</span>
                                    <input
                                        type="checkbox"
                                        checked={newLicense.limit >= 999999}
                                        onChange={(e) => setNewLicense({ ...newLicense, limit: e.target.checked ? 1000000 : 1000 })}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                    />
                                </label>
                            </div>
                            <input
                                type="number"
                                disabled={newLicense.limit >= 999999}
                                value={newLicense.limit >= 999999 ? '' : newLicense.limit}
                                onChange={(e) => setNewLicense({ ...newLicense, limit: parseInt(e.target.value) || 0 })}
                                className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${newLicense.limit >= 999999
                                    ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed placeholder:text-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-400'
                                    }`}
                                placeholder={newLicense.limit >= 999999 ? "Unlimited" : "e.g. 1000"}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-1">Duration (Days)</label>
                        <input
                            type="number"
                            value={newLicense.duration}
                            onChange={(e) => setNewLicense({ ...newLicense, duration: parseInt(e.target.value) })}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                            placeholder="30"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave 0 for no expiration</p>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create License'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
