import { delay, generateId } from '../utils/helpers';

const mockSlots = Array.from({ length: 20 }, (_, i) => {
    const rows = ['A', 'B', 'C', 'D'];
    const row = rows[Math.floor(i / 5)];
    const col = (i % 5) + 1;
    const statusWeight = Math.random();
    let status;
    if (statusWeight < 0.45) status = 'available';
    else if (statusWeight < 0.8) status = 'occupied';
    else if (statusWeight < 0.95) status = 'reserved';
    else status = 'disabled';
    return {
        id: `sec-${row}${col}`,
        slotNumber: `${row}${col}`,
        status,
        basementName: 'Tower A - B1',
    };
});

export const securityService = {
    generateTicket: async ({ vehicleNumber, vehicleType, building, basement }) => {
        await delay(800);
        const slot = mockSlots.find(s => s.status === 'available');
        return {
            success: true,
            data: {
                ticketId: 'TKT-' + generateId().toUpperCase(),
                vehicleNumber,
                vehicleType,
                building,
                basement,
                slotNumber: slot ? slot.slotNumber : 'A1',
                entryTime: new Date().toISOString(),
                qrData: `PARK-${vehicleNumber}-${Date.now()}`,
            },
        };
    },

    searchVehicle: async (vehicleNumber) => {
        await delay(600);
        return {
            success: true,
            data: {
                driverName: 'Rajesh Kumar',
                phone: '+91-9876543210',
                email: 'rajesh.kumar@email.com',
                vehicleNumber: vehicleNumber || 'MH-12-AB-1234',
                vehicleType: '4W',
                subscription: 'Premium Monthly',
                licenseNumber: 'MH-0112345678901',
                previousEntries: 45,
            },
        };
    },

    processPayment: async (ticketId) => {
        await delay(700);
        return {
            success: true,
            data: {
                receiptId: 'RCP-' + generateId().toUpperCase(),
                amount: 120,
                method: 'Cash',
                paidAt: new Date().toISOString(),
            },
        };
    },

    getAvailableSlots: async (basementId) => {
        await delay(500);
        return { success: true, data: mockSlots };
    },

    allocateSlot: async (slotId, vehicleNumber) => {
        await delay(500);
        return { success: true, data: { slotId, vehicleNumber, allocatedAt: new Date().toISOString() } };
    },

    verifyPayment: async (ticketId) => {
        await delay(500);
        return {
            success: true,
            data: {
                ticketId,
                vehicleNumber: 'MH-12-AB-1234',
                amount: 120,
                status: 'paid',
                paidAt: new Date().toISOString(),
            },
        };
    },

    getPendingPayments: async () => {
        await delay(600);
        return {
            success: true,
            data: [
                { ticketId: 'TKT-A1B2C3D4', vehicleNumber: 'MH-12-AB-1234', amount: 120, entryTime: new Date(Date.now() - 3 * 3600000).toISOString(), status: 'pending' },
                { ticketId: 'TKT-E5F6G7H8', vehicleNumber: 'MH-04-CD-5678', amount: 80, entryTime: new Date(Date.now() - 2 * 3600000).toISOString(), status: 'pending' },
                { ticketId: 'TKT-I9J0K1L2', vehicleNumber: 'MH-01-EF-9012', amount: 40, entryTime: new Date(Date.now() - 1 * 3600000).toISOString(), status: 'pending' },
            ],
        };
    },

    getDashboardStats: async () => {
        await delay(700);
        return {
            success: true,
            data: {
                stats: {
                    totalEntriesDay: 45,
                    totalExitsDay: 38,
                    pendingVerifications: 12,
                    activeVehicles: 45,
                },
                activities: [
                    { type: 'entry', vehicleNumber: 'MH-12-AB-1234', ticketId: 'TKT-001', timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
                    { type: 'exit', vehicleNumber: 'MH-04-CD-5678', ticketId: 'TKT-002', timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
                    { type: 'entry', vehicleNumber: 'MH-01-EF-9012', ticketId: 'TKT-003', timestamp: new Date(Date.now() - 25 * 60000).toISOString() },
                    { type: 'exit', vehicleNumber: 'KA-01-AB-1234', ticketId: 'TKT-004', timestamp: new Date(Date.now() - 35 * 60000).toISOString() },
                    { type: 'entry', vehicleNumber: 'DL-01-CD-5678', ticketId: 'TKT-005', timestamp: new Date(Date.now() - 45 * 60000).toISOString() },
                    { type: 'exit', vehicleNumber: 'GJ-01-EF-9012', ticketId: 'TKT-006', timestamp: new Date(Date.now() - 55 * 60000).toISOString() },
                ],
            },
        };
    },
};
