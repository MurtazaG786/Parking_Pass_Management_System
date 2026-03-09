import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ParkingSquare } from 'lucide-react';
import { Dropdown } from 'primereact/dropdown';
import { securityService } from '../../services/securityService';
import { PageLoader, EmptyState } from '../../components/common/Loader';
import { SLOT_COLORS } from '../../utils/constants';

const SlotAllocation = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBasement, setSelectedBasement] = useState('B1');

    const basementOptions = [
        { label: 'Tower A - B1', value: 'B1' },
        { label: 'Tower A - B2', value: 'B2' },
        { label: 'Tower B - B1', value: 'B3' },
    ];

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await securityService.getAvailableSlots(selectedBasement);
                if (res.success) setSlots(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [selectedBasement]);

    const handleSelectSlot = async (slot) => {
        if (slot.status !== 'available') return;
        try {
            await securityService.allocateSlot(slot.id, 'MANUAL');
            setSlots(prev => prev.map(s => s.id === slot.id ? { ...s, status: 'occupied' } : s));
        } catch (err) {
            console.error(err);
        }
    };

    const slotsGrouped = {};
    slots.forEach(s => {
        const row = s.slotNumber.charAt(0);
        if (!slotsGrouped[row]) slotsGrouped[row] = [];
        slotsGrouped[row].push(s);
    });

    const counts = {
        available: slots.filter(s => s.status === 'available').length,
        occupied: slots.filter(s => s.status === 'occupied').length,
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Slot Allocation</h1>
                    <p className="text-sm text-neutral-600 mt-1">Select and allocate parking slots in real-time</p>
                </div>
                <div className="w-full sm:w-64">
                    <Dropdown
                        value={selectedBasement}
                        onChange={(e) => setSelectedBasement(e.value)}
                        options={basementOptions}
                        className="w-full"
                        pt={{ root: { className: 'w-full border border-neutral-300 rounded-lg bg-white' }, input: { className: 'px-3.5 py-2.5 text-sm text-neutral-900' } }}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-card">
                <div className="flex flex-wrap items-center gap-6">
                    {Object.entries(SLOT_COLORS).filter(([k]) => ['available', 'occupied'].includes(k)).map(([status, colors]) => (
                        <div key={status} className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded ${colors.dot}`} />
                            <span className="text-sm font-medium text-neutral-700">
                                {status === 'available' ? '✓ Available' : '✗ Occupied'} ({counts[status] || 0})
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {loading ? (
                <PageLoader />
            ) : slots.length === 0 ? (
                <EmptyState icon={ParkingSquare} title="No slots found" description="Select a basement to view available parking slots." />
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg border border-neutral-200 p-8 shadow-card">
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {Object.entries(slotsGrouped).map(([row, rowSlots]) => (
                            <div key={row} className="flex items-center gap-4">
                                <div className="w-14 flex-shrink-0">
                                    <span className="text-xs font-bold text-neutral-500 bg-neutral-100 w-full h-10 rounded-lg flex items-center justify-center">
                                        {row}-Gate
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-wrap gap-2.5">
                                    {rowSlots.map((slot) => {
                                        const colors = SLOT_COLORS[slot.status];
                                        return (
                                            <motion.button
                                                key={slot.id}
                                                whileHover={slot.status === 'available' ? { scale: 1.08 } : {}}
                                                whileTap={slot.status === 'available' ? { scale: 0.95 } : {}}
                                                onClick={() => handleSelectSlot(slot)}
                                                disabled={slot.status !== 'available'}
                                                className={`w-20 h-14 rounded-lg border-2 ${colors.bg} ${colors.border} flex items-center justify-center font-semibold text-sm transition-all ${slot.status === 'available' ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed opacity-60'
                                                    }`}
                                            >
                                                <span className={colors.text}>{slot.slotNumber}</span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default SlotAllocation;
