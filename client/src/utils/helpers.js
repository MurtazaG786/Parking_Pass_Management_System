// Format currency in INR
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
    }).format(amount);
};

// Format date
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

// Format time
export const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

// Format date + time
export const formatDateTime = (date) => {
    return `${formatDate(date)} ${formatTime(date)}`;
};

// Calculate duration between two dates
export const calculateDuration = (start, end) => {
    const diff = new Date(end) - new Date(start);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
};

// Get status badge classes
export const getStatusClasses = (status) => {
    const map = {
        active: 'bg-green-100 text-green-700',
        inactive: 'bg-gray-100 text-gray-600',
        pending: 'bg-yellow-100 text-yellow-700',
        expired: 'bg-red-100 text-red-700',
        paid: 'bg-green-100 text-green-700',
        unpaid: 'bg-red-100 text-red-700',
        available: 'bg-green-100 text-green-700',
        occupied: 'bg-red-100 text-red-700',
        reserved: 'bg-yellow-100 text-yellow-700',
        disabled: 'bg-gray-100 text-gray-500',
    };
    return map[status] || 'bg-gray-100 text-gray-600';
};

// Simulate API delay
export const delay = (ms = 600) => new Promise((res) => setTimeout(res, ms));

// Generate random ID
export const generateId = () => Math.random().toString(36).substring(2, 10);

// Capitalize first letter
export const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
