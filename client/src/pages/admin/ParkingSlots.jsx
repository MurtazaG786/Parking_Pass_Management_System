import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ParkingSquare, RefreshCw } from 'lucide-react';
import { Dropdown } from 'primereact/dropdown';
import Button from '../../components/common/Button';
import { adminService } from '../../services/adminService';
import { PageLoader, EmptyState, ErrorState } from '../../components/common/Loader';
import { SLOT_COLORS } from '../../utils/constants';

const ParkingSlots = () => {
    const [slots, setSlots] = useState([]);
    const [basements, setBasements] = useState([]);
    const [selectedBasement, setSelectedBasement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBasements = async () => {
            try {
                const res = await adminService.getBasements();
                if (res.success) {
                    setBasements(res.data);
                    if (res.data.length > 0) setSelectedBasement(res.data[0].id);
                }
            } catch (err) {
                setError('Failed to load basements');
            }
        };
        fetchBasements();
    }, []);

    useEffect(() => {
        if (!selectedBasement) return;
        const fetchSlots = async () => {
            setLoading(true);
            try {
                const res = await adminService.getParkingSlots(selectedBasement);
                if (res.success) setSlots(res.data);
            } catch (err) {
                setError('Failed to load slots');
            } finally {
                setLoading(false);
            }
        };
        fetchSlots();
    }, [selectedBasement]);

    const basementOptions = basements.map(b => ({ label: `${b.buildingName} - ${b.name}`, value: b.id }));
    const slotsGrouped = {};
    slots.forEach(s => {
        const row = s.slotNumber.charAt(0);
        if (!slotsGrouped[row]) slotsGrouped[row] = [];
        slotsGrouped[row].push(s);
    });

    const counts = {
        available: slots.filter(s => s.status === 'available').length,
        occupied: slots.filter(s => s.status === 'occupied').length,
        reserved: slots.filter(s => s.status === 'reserved').length,
        disabled: slots.filter(s => s.status === 'disabled').length,
    };

    if (error) return <ErrorState message={error} />;

    const basement = basements.find(b => b.id === selectedBasement);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Parking Slots</h1>
                    <p className="text-sm text-neutral-600 mt-1">Interactive parking slot management and visualization</p>
                </div>
                <Button variant="outline" icon={RefreshCw} size="md">
                    Refresh
                </Button>
            </div>

            {/* Basement Selector */}
            <div className="w-full sm:w-80">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Select Basement</label>
                <Dropdown
                    value={selectedBasement}
                    onChange={(e) => setSelectedBasement(e.value)}
                    options={basementOptions}
                    placeholder="Choose basement..."
                    className="w-full"
                    pt={{
                        root: { className: 'w-full border border-neutral-300 rounded-lg bg-white' },
                        input: { className: 'px-3.5 py-2.5 text-sm text-neutral-900' },
                        item: { className: 'text-sm py-2' },
                    }}
                />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Total Slots', value: slots.length, color: 'from-primary-500 to-primary-600' },
                    { label: 'Available', value: counts.available, color: 'from-success-500 to-success-600' },
                    { label: 'Occupied', value: counts.occupied, color: 'from-danger-500 to-danger-600' },
                    { label: 'Reserved', value: counts.reserved, color: 'from-warning-500 to-warning-600' },
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-lg border border-neutral-200 p-4 shadow-card"
                    >
                        <p className="text-xs text-neutral-600 font-medium mb-1.5">{stat.label}</p>
                        <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Legend */}
            {!loading && slots.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg border border-neutral-200 p-4 shadow-card"
                >
                    <p className="text-xs font-semibold text-neutral-700 uppercase mb-3">Legend</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { status: 'available', color: 'bg-success-100', border: 'border-success-300', label: 'Available', icon: '✓' },
                            { status: 'occupied', color: 'bg-danger-100', border: 'border-danger-300', label: 'Occupied', icon: '✕' },
                            { status: 'reserved', color: 'bg-warning-100', border: 'border-warning-300', label: 'Reserved', icon: '★' },
                            { status: 'disabled', color: 'bg-neutral-100', border: 'border-neutral-300', label: 'Disabled', icon: '–' },
                        ].map(item => (
                            <div key={item.status} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded border-2 ${item.color} ${item.border} flex items-center justify-center text-xs font-bold text-neutral-600`}>
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-neutral-700">{item.label}</p>
                                    <p className="text-xs text-neutral-500">{counts[item.status] || 0} slots</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Parking Slot Visualization */}
            {loading ? (
                <PageLoader />
            ) : slots.length === 0 ? (
                <EmptyState
                    icon={ParkingSquare}
                    title="No parking slots found"
                    description="Select a basement to view parking slots. If no slots are visible, configure them first."
                />
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-lg border border-neutral-200 p-8 shadow-card"
                >
                    {/* Basement Header */}
                    {basement && (
                        <div className="text-center mb-8 pb-6 border-b border-neutral-200">
                            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                                {basement.buildingName}
                            </p>
                            <h3 className="text-xl font-bold text-neutral-900">{basement.name}</h3>
                        </div>
                    )}

                    {/* Slot Grid */}
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {Object.entries(slotsGrouped).map(([row, rowSlots]) => (
                            <div key={row} className="flex items-center gap-3">
                                {/* Row Label */}
                                <div className="w-12 flex-shrink-0">
                                    <span className="text-xs font-bold text-neutral-600 bg-neutral-100 w-full h-10 rounded-lg flex items-center justify-center">
                                        {row}-Gate
                                    </span>
                                </div>

                                {/* Slot Row */}
                                <div className="flex-1 flex flex-wrap gap-2">
                                    {rowSlots.map((slot, idx) => {
                                        const statusConfig = {
                                            available: { bg: 'bg-success-100', border: 'border-success-300', text: 'text-success-700', label: '✓' },
                                            occupied: { bg: 'bg-danger-100', border: 'border-danger-300', text: 'text-danger-700', label: '✕' },
                                            reserved: { bg: 'bg-warning-100', border: 'border-warning-300', text: 'text-warning-700', label: '★' },
                                            disabled: { bg: 'bg-neutral-100', border: 'border-neutral-300', text: 'text-neutral-700', label: '–' },
                                        };

                                        const config = statusConfig[slot.status] || statusConfig.disabled;

                                        return (
                                            <motion.button
                                                key={slot.id}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.02 }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`w-20 h-14 rounded-lg border-2 ${config.bg} ${config.border} flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-md`}
                                                title={`${slot.slotNumber}${slot.vehicleNumber ? ` - ${slot.vehicleNumber}` : ''}`}
                                            >
                                                <span className={`text-sm font-bold ${config.text}`}>
                                                    {slot.slotNumber}
                                                </span>
                                                <span className={`text-xs ${config.text} opacity-70`}>
                                                    {slot.vehicleType}
                                                </span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Entry/Exit Indicator */}
                    <div className="flex justify-between items-end mt-8 pt-6 border-t border-neutral-200 max-w-4xl mx-auto">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-1 bg-success-500 rounded" />
                            <span className="text-xs font-medium text-success-700">Entry Point →</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-danger-700">← Exit Point</span>
                            <div className="w-8 h-1 bg-danger-500 rounded" />
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ParkingSlots;
