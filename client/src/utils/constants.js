// Theme colors
export const COLORS = {
    primary: '#2563EB',
    secondary: '#10B981',
    background: '#F8FAFC',
    card: '#FFFFFF',
    border: '#E5E7EB',
    danger: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
};

// Roles
export const ROLES = {
    ADMIN: 'admin',
    SECURITY: 'security',
    DRIVER: 'driver',
};

// Slot statuses
export const SLOT_STATUS = {
    AVAILABLE: 'available',
    OCCUPIED: 'occupied',
    RESERVED: 'reserved',
    DISABLED: 'disabled',
};

export const SLOT_COLORS = {
    available: { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-700', dot: 'bg-green-500' },
    occupied: { bg: 'bg-red-100', border: 'border-red-400', text: 'text-red-700', dot: 'bg-red-500' },
    reserved: { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    disabled: { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-500', dot: 'bg-gray-400' },
};

// Vehicle types
export const VEHICLE_TYPES = [
    { label: '2 Wheeler', value: '2W' },
    { label: '4 Wheeler', value: '4W' },
];

// Admin sidebar links
export const ADMIN_LINKS = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard' },
    { label: 'Buildings', path: '/admin/buildings', icon: 'Building2' },
    { label: 'Basements', path: '/admin/basements', icon: 'Layers' },
    { label: 'Slots', path: '/admin/slots', icon: 'ParkingSquare' },
    { label: 'Pricing', path: '/admin/pricing', icon: 'IndianRupee' },
    { label: 'Subscriptions', path: '/admin/subscriptions', icon: 'CreditCard' },
    { label: 'Security Management', path: '/admin/security-management', icon: 'ShieldCheck' },
    { label: 'Reports', path: '/admin/reports', icon: 'BarChart3' },
];

// Security sidebar links
export const SECURITY_LINKS = [
    { label: 'Dashboard', path: '/security/dashboard', icon: 'LayoutDashboard' },
    { label: 'Entry', path: '/security/entry', icon: 'LogIn' },
    { label: 'Exit', path: '/security/exit', icon: 'LogOut' },
    { label: 'Slot Allocation', path: '/security/slot-allocation', icon: 'ParkingSquare' },
    // { label: 'Tickets', path: '/security/tickets', icon: 'Ticket' },
    { label: 'Payments', path: '/security/payments', icon: 'Wallet' },
];

// Driver sidebar links
export const DRIVER_LINKS = [
    { label: 'Dashboard', path: '/driver/dashboard', icon: 'LayoutDashboard' },
    { label: 'Slots', path: '/driver/slots', icon: 'ParkingSquare' },
    { label: 'Tickets', path: '/driver/tickets', icon: 'Ticket' },
    { label: 'Payments', path: '/driver/payments', icon: 'Wallet' },
    { label: 'Subscriptions', path: '/driver/subscriptions', icon: 'CreditCard' },
];

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
