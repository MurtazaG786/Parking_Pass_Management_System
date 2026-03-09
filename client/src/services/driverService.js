import { delay } from '../utils/helpers';

export const driverService = {
    getDashboard: async () => {
        await delay(600);
        return {
            success: true,
            data: {
                activeParking: {
                    ticketId: 'TKT-X1Y2Z3W4',
                    vehicleNumber: 'MH-12-AB-1234',
                    slotNumber: 'A3',
                    building: 'Tower A',
                    basement: 'B1',
                    entryTime: new Date(Date.now() - 2 * 3600000).toISOString(),
                    vehicleType: '4W',
                },
                parkingHistory: [
                    { id: '1', building: 'Tower A', slot: 'B2', date: '2026-03-07', duration: '2h 30m', charge: 100, status: 'completed' },
                    { id: '2', building: 'Mall Complex', slot: 'A5', date: '2026-03-06', duration: '1h 15m', charge: 60, status: 'completed' },
                    { id: '3', building: 'Tower B', slot: 'C1', date: '2026-03-05', duration: '4h 00m', charge: 160, status: 'completed' },
                    { id: '4', building: 'Tower A', slot: 'A1', date: '2026-03-04', duration: '0h 45m', charge: 40, status: 'completed' },
                ],
                subscription: {
                    planName: 'Premium 4W Monthly',
                    validUntil: '2026-04-07',
                    building: 'Tower A',
                    slot: 'A3',
                    status: 'active',
                },
            },
        };
    },

    getAvailableSlots: async () => {
        await delay(600);
        const buildings = [
            {
                id: '1', name: 'Tower A', basements: [
                    { id: '1', name: 'B1', slots: Array.from({ length: 20 }, (_, i) => ({ id: `1-${i}`, slotNumber: `${['A', 'B', 'C', 'D'][Math.floor(i / 5)]}${(i % 5) + 1}`, status: Math.random() > 0.5 ? 'available' : 'occupied' })) },
                    { id: '2', name: 'B2', slots: Array.from({ length: 20 }, (_, i) => ({ id: `2-${i}`, slotNumber: `${['A', 'B', 'C', 'D'][Math.floor(i / 5)]}${(i % 5) + 1}`, status: Math.random() > 0.4 ? 'available' : 'occupied' })) },
                ],
            },
            {
                id: '2', name: 'Tower B', basements: [
                    { id: '3', name: 'B1', slots: Array.from({ length: 15 }, (_, i) => ({ id: `3-${i}`, slotNumber: `${['A', 'B', 'C'][Math.floor(i / 5)]}${(i % 5) + 1}`, status: Math.random() > 0.6 ? 'available' : 'occupied' })) },
                ],
            },
        ];
        return { success: true, data: buildings };
    },

    getActiveTicket: async () => {
        await delay(500);
        return {
            success: true,
            data: {
                ticketId: 'TKT-X1Y2Z3W4',
                vehicleNumber: 'MH-12-AB-1234',
                vehicleType: '4W',
                slotNumber: 'A3',
                building: 'Tower A',
                basement: 'B1',
                entryTime: new Date(Date.now() - 2 * 3600000).toISOString(),
                qrData: 'PARK-MH-12-AB-1234-1709890000000',
            },
        };
    },

    getPaymentDetails: async () => {
        await delay(600);
        return {
            success: true,
            data: {
                ticketId: 'TKT-X1Y2Z3W4',
                vehicleNumber: 'MH-12-AB-1234',
                vehicleType: '4W',
                building: 'Tower A',
                basement: 'B1',
                slotNumber: 'A3',
                entryTime: new Date(Date.now() - 2 * 3600000).toISOString(),
                exitTime: new Date().toISOString(),
                duration: '2h 15m',
                ratePerHour: 40,
                totalAmount: 120,
                tax: 12,
                grandTotal: 132,
            },
        };
    },

    makePayment: async (paymentData) => {
        await delay(800);
        return {
            success: true,
            data: {
                receiptId: 'RCP-' + Date.now(),
                amount: paymentData.amount,
                method: paymentData.method,
                paidAt: new Date().toISOString(),
            },
        };
    },

    getSubscriptionPlans: async () => {
        await delay(500);
        return {
            success: true,
            data: [
                { id: '1', name: 'Basic 2W Monthly', vehicleType: '2W', duration: '30 days', price: 1500, features: ['Reserved slot', 'Entry/Exit anytime', 'SMS notifications'], popular: false },
                { id: '2', name: 'Premium 4W Monthly', vehicleType: '4W', duration: '30 days', price: 3000, features: ['Reserved slot', 'Priority parking', 'SMS + Email notifications', 'Covered parking'], popular: true },
                { id: '3', name: 'Basic 4W Weekly', vehicleType: '4W', duration: '7 days', price: 900, features: ['Reserved slot', 'Entry/Exit anytime'], popular: false },
                { id: '4', name: 'Basic 2W Weekly', vehicleType: '2W', duration: '7 days', price: 450, features: ['Reserved slot', 'Entry/Exit anytime'], popular: false },
            ],
        };
    },

    subscribe: async (planId) => {
        await delay(800);
        return {
            success: true,
            data: {
                subscriptionId: 'SUB-' + Date.now(),
                planId,
                startDate: new Date().toISOString(),
                status: 'active',
            },
        };
    },
};
