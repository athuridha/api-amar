export interface Stats {
    totalLicenses: number;
    activeLicenses: number;
    totalScrapesToday: number;
    uniqueUsersToday: number;
    date: string;
}

export interface License {
    id: string;
    license_key: string;
    email: string;
    plan: string;
    daily_limit: number;
    is_active: boolean;
    created_at: string;
    expires_at: string | null;
}

export interface UsageLog {
    id: string;
    license_id: string | null;
    device_id: string | null;
    date: string;
    count: number;
}

export interface Customer {
    deviceId: string;
    ipAddress: string;
    userAgent: string;
    totalScrapes: number;
    lastActive: string;
}

export interface SuspiciousActivity {
    ipAddress: string;
    date: string;
    deviceCount: number;
    deviceIds: string[];
}
