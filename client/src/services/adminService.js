import { delay, generateId } from '../utils/helpers';

// ── Mock Data ──
const mockBuildings = [
    { id: '1', name: 'Tower A', location: '123 Main Street', basements: 3, totalSlots: 120, status: 'active' },
    { id: '2', name: 'Tower B', location: '456 Park Avenue', basements: 2, totalSlots: 80, status: 'active' },
    { id: '3', name: 'Mall Complex', location: '789 Market Road', basements: 4, totalSlots: 200, status: 'active' },
    { id: '4', name: 'Office Park', location: '321 Business Blvd', basements: 1, totalSlots: 40, status: 'inactive' },
];

const mockBasements = [
    { id: '1', buildingId: '1', buildingName: 'Tower A', name: 'B1', floor: -1, totalSlots: 40, occupiedSlots: 28, status: 'active' },
    { id: '2', buildingId: '1', buildingName: 'Tower A', name: 'B2', floor: -2, totalSlots: 40, occupiedSlots: 15, status: 'active' },
    { id: '3', buildingId: '1', buildingName: 'Tower A', name: 'B3', floor: -3, totalSlots: 40, occupiedSlots: 35, status: 'active' },
    { id: '4', buildingId: '2', buildingName: 'Tower B', name: 'B1', floor: -1, totalSlots: 40, occupiedSlots: 20, status: 'active' },
    { id: '5', buildingId: '2', buildingName: 'Tower B', name: 'B2', floor: -2, totalSlots: 40, occupiedSlots: 10, status: 'active' },
    { id: '6', buildingId: '3', buildingName: 'Mall Complex', name: 'B1', floor: -1, totalSlots: 50, occupiedSlots: 45, status: 'active' },
];

const generateSlots = (basementId, basementName, count) => {
    const statuses = ['available', 'occupied', 'reserved', 'disabled'];
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const slots = [];
    let idx = 0;
    for (const row of rows) {
        for (let col = 1; col <= Math.ceil(count / rows.length); col++) {
            if (idx >= count) break;
            const statusWeight = Math.random();
            let status;
            if (statusWeight < 0.4) status = 'available';
            else if (statusWeight < 0.75) status = 'occupied';
            else if (statusWeight < 0.9) status = 'reserved';
            else status = 'disabled';
            slots.push({
                id: `${basementId}-${row}${col}`,
                basementId,
                basementName,
                slotNumber: `${row}${col}`,
                status,
                vehicleNumber: status === 'occupied' ? `MH-${Math.floor(Math.random() * 50)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(1000 + Math.random() * 9000)}` : null,
                vehicleType: status === 'occupied' ? (Math.random() > 0.5 ? '4W' : '2W') : null,
            });
            idx++;
        }
    }
    return slots;
};

const mockSlots = [
    ...generateSlots('1', 'Tower A - B1', 40),
    ...generateSlots('2', 'Tower A - B2', 40),
    ...generateSlots('4', 'Tower B - B1', 40),
];

const mockPricing = [
    { id: '1', vehicleType: '2 Wheeler', hourlyRate: 20, dailyRate: 100, monthlyRate: 1500, status: 'active' },
    { id: '2', vehicleType: '4 Wheeler', hourlyRate: 40, dailyRate: 200, monthlyRate: 3000, status: 'active' },
];

const mockSubscriptions = [
    { id: '1', planName: 'Basic 2W Monthly', vehicleType: '2W', duration: '30 days', price: 1500, features: ['Reserved slot', 'Entry/Exit anytime', 'SMS notifications'], status: 'active', subscribers: 45 },
    { id: '2', planName: 'Premium 4W Monthly', vehicleType: '4W', duration: '30 days', price: 3000, features: ['Reserved slot', 'Priority parking', 'SMS + Email notifications', 'Covered parking'], status: 'active', subscribers: 32 },
    { id: '3', planName: 'Basic 4W Weekly', vehicleType: '4W', duration: '7 days', price: 900, features: ['Reserved slot', 'Entry/Exit anytime'], status: 'active', subscribers: 18 },
];

const mockSecurityGuards = [
    { id: '1', name: 'Ramesh Kumar', email: 'ramesh@parkease.com', phone: '9876543210', assignedBuilding: 'Tower A', shift: 'Day', status: 'active' },
    { id: '2', name: 'Suresh Patil', email: 'suresh@parkease.com', phone: '9876543211', assignedBuilding: 'Tower B', shift: 'Night', status: 'active' },
    { id: '3', name: 'Vikram Singh', email: 'vikram@parkease.com', phone: '9876543212', assignedBuilding: 'Mall Complex', shift: 'Day', status: 'inactive' },
];

const mockDashboardStats = {
    totalVehiclesToday: 342,
    activeSessions: 128,
    totalRevenue: 48750,
    availableSlots: 152,
    hourlyUsage: [
        { hour: '6AM', count: 12 }, { hour: '7AM', count: 35 }, { hour: '8AM', count: 78 },
        { hour: '9AM', count: 125 }, { hour: '10AM', count: 142 }, { hour: '11AM', count: 138 },
        { hour: '12PM', count: 130 }, { hour: '1PM', count: 120 }, { hour: '2PM', count: 115 },
        { hour: '3PM', count: 105 }, { hour: '4PM', count: 95 }, { hour: '5PM', count: 110 },
        { hour: '6PM', count: 125 }, { hour: '7PM', count: 90 }, { hour: '8PM', count: 60 },
    ],
    revenueByType: [
        { type: '2 Wheeler', revenue: 18500 },
        { type: '4 Wheeler', revenue: 30250 },
    ],
    basementOccupancy: [
        { name: 'Tower A - B1', occupied: 28, total: 40 },
        { name: 'Tower A - B2', occupied: 15, total: 40 },
        { name: 'Tower A - B3', occupied: 35, total: 40 },
        { name: 'Tower B - B1', occupied: 20, total: 40 },
        { name: 'Tower B - B2', occupied: 10, total: 40 },
        { name: 'Mall - B1', occupied: 45, total: 50 },
    ],
};

const mockReports = {
    dailyRevenue: [
        { date: 'Mar 1', revenue: 42000 }, { date: 'Mar 2', revenue: 38000 },
        { date: 'Mar 3', revenue: 45000 }, { date: 'Mar 4', revenue: 48000 },
        { date: 'Mar 5', revenue: 40000 }, { date: 'Mar 6', revenue: 52000 },
        { date: 'Mar 7', revenue: 48750 },
    ],
    vehicleCount: [
        { date: 'Mar 1', twoWheeler: 180, fourWheeler: 150 },
        { date: 'Mar 2', twoWheeler: 160, fourWheeler: 140 },
        { date: 'Mar 3', twoWheeler: 200, fourWheeler: 170 },
        { date: 'Mar 4', twoWheeler: 190, fourWheeler: 165 },
        { date: 'Mar 5', twoWheeler: 175, fourWheeler: 155 },
        { date: 'Mar 6', twoWheeler: 210, fourWheeler: 180 },
        { date: 'Mar 7', twoWheeler: 195, fourWheeler: 147 },
    ],
};

// ── Service Functions ──
export const adminService = {
    getDashboardStats: async () => {
        await delay(700);
        return { success: true, data: mockDashboardStats };
    },

    getBuildings: async () => {
        await delay(500);
        return { success: true, data: mockBuildings };
    },
    createBuilding: async (building) => {
        await delay(500);
        return { success: true, data: { id: generateId(), ...building, status: 'active' } };
    },
    updateBuilding: async (id, building) => {
        await delay(500);
        return { success: true, data: { id, ...building } };
    },
    deleteBuilding: async (id) => {
        await delay(400);
        return { success: true };
    },

    getBasements: async () => {
        await delay(500);
        return { success: true, data: mockBasements };
    },
    createBasement: async (basement) => {
        await delay(500);
        return { success: true, data: { id: generateId(), ...basement, occupiedSlots: 0, status: 'active' } };
    },
    updateBasement: async (id, basement) => {
        await delay(500);
        return { success: true, data: { id, ...basement } };
    },
    deleteBasement: async (id) => {
        await delay(400);
        return { success: true };
    },

    getParkingSlots: async (basementId) => {
        await delay(600);
        const slots = basementId ? mockSlots.filter(s => s.basementId === basementId) : mockSlots;
        return { success: true, data: slots };
    },
    updateSlotStatus: async (slotId, status) => {
        await delay(400);
        return { success: true };
    },

    getPricing: async () => {
        await delay(400);
        return { success: true, data: mockPricing };
    },
    updatePricing: async (id, pricing) => {
        await delay(500);
        return { success: true, data: { id, ...pricing } };
    },

    getSubscriptions: async () => {
        await delay(500);
        return { success: true, data: mockSubscriptions };
    },
    createSubscription: async (plan) => {
        await delay(500);
        return { success: true, data: { id: generateId(), ...plan, subscribers: 0, status: 'active' } };
    },
    updateSubscription: async (id, plan) => {
        await delay(500);
        return { success: true, data: { id, ...plan } };
    },

    getSecurityGuards: async () => {
        await delay(500);
        return { success: true, data: mockSecurityGuards };
    },
    createSecurityGuard: async (guard) => {
        await delay(500);
        return { success: true, data: { id: generateId(), ...guard, status: 'active' } };
    },
    updateSecurityGuard: async (id, guard) => {
        await delay(500);
        return { success: true, data: { id, ...guard } };
    },
    deleteSecurityGuard: async (id) => {
        await delay(400);
        return { success: true };
    },

    getReports: async (dateRange) => {
        await delay(800);
        return { success: true, data: mockReports };
    },
};
