import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Car, Building2, Layers, Ticket, CheckCircle2, Clock, User, MapPin, ParkingSquare, Search, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { securityService } from '../../services/securityService';
import { VEHICLE_TYPES } from '../../utils/constants';
import { formatDateTime } from '../../utils/helpers';

const Entry = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [vehicleType, setVehicleType] = useState('4W');
    const [building, setBuilding] = useState(null);
    const [basement, setBasement] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ticket, setTicket] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [driverDetails, setDriverDetails] = useState(null);
    const [searchingDriver, setSearchingDriver] = useState(false);

    const buildingOptions = [
        { label: 'Tower A', value: 'Tower A' },
        { label: 'Tower B', value: 'Tower B' },
        { label: 'Mall Complex', value: 'Mall Complex' },
    ];

    const basementOptions = [
        { label: 'B1 (Floor -1)', value: 'B1' },
        { label: 'B2 (Floor -2)', value: 'B2' },
        { label: 'B3 (Floor -3)', value: 'B3' },
    ];

    const handleBasementChange = async (basementValue) => {
        setBasement(basementValue);
        // Fetch available slots for selected basement
        try {
            const res = await securityService.getAvailableSlots(basementValue);
            if (res.success) {
                setAvailableSlots(res.data || []);
                setSelectedSlot(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearchDriver = async (vehicleNumber) => {
        if (!vehicleNumber) return;
        setSearchingDriver(true);
        try {
            const res = await securityService.searchVehicle(vehicleNumber);
            if (res.success) {
                setDriverDetails(res.data || null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSearchingDriver(false);
        }
    };

    const onSubmit = async (data) => {
        if (!selectedSlot) {
            alert('Please select a parking slot');
            return;
        }
        setLoading(true);
        try {
            const res = await securityService.generateTicket({
                vehicleNumber: data.vehicleNumber,
                vehicleType,
                building,
                basement,
                slotId: selectedSlot,
            });
            if (res.success) setTicket(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleNewEntry = () => {
        setTicket(null);
        reset();
        setBuilding(null);
        setBasement(null);
        setSelectedSlot(null);
        setDriverDetails(null);
        setAvailableSlots([]);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Vehicle Entry</h1>
                <p className="text-sm text-text-secondary mt-1">Register new vehicle entry, view driver details, and allocate parking slots</p>
            </div>

            <AnimatePresence mode="wait">
                {!ticket ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    >
                        {/* Left Column: Entry Form & Driver Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Vehicle Entry Form */}
                            <motion.div
                                className="bg-white rounded-lg border border-surface-200 p-6 shadow-md"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                                        <LogIn className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-text-primary">Vehicle Entry Form</h2>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    <Input
                                        label="Vehicle Number"
                                        icon={Car}
                                        placeholder="MH-12-AB-1234"
                                        {...register('vehicleNumber', { required: 'Vehicle number is required' })}
                                        error={errors.vehicleNumber?.message}
                                        onBlur={(e) => handleSearchDriver(e.target.value)}
                                    />

                                    <div>
                                        <label className="block text-sm font-semibold text-text-primary mb-2">Vehicle Type</label>
                                        <Dropdown
                                            value={vehicleType}
                                            onChange={(e) => setVehicleType(e.value)}
                                            options={VEHICLE_TYPES}
                                            className="w-full"
                                            pt={{ root: { className: 'w-full border border-surface-200 rounded-lg bg-white' }, input: { className: 'px-3.5 py-2.5 text-sm text-text-primary' } }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-text-primary mb-2">Building</label>
                                            <Dropdown
                                                value={building}
                                                onChange={(e) => setBuilding(e.value)}
                                                options={buildingOptions}
                                                placeholder="Select Building"
                                                className="w-full"
                                                pt={{ root: { className: 'w-full border border-surface-200 rounded-lg bg-white' }, input: { className: 'px-3.5 py-2.5 text-sm text-text-primary' } }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-text-primary mb-2">Basement</label>
                                            <Dropdown
                                                value={basement}
                                                onChange={(e) => handleBasementChange(e.value)}
                                                options={basementOptions}
                                                placeholder="Select Basement"
                                                className="w-full"
                                                pt={{ root: { className: 'w-full border border-surface-200 rounded-lg bg-white' }, input: { className: 'px-3.5 py-2.5 text-sm text-text-primary' } }}
                                            />
                                        </div>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        loading={loading} 
                                        className="w-full" 
                                        size="lg" 
                                        disabled={!selectedSlot} 
                                        icon={Ticket}
                                    >
                                        Generate Ticket {selectedSlot && `(Slot: ${selectedSlot})`}
                                    </Button>
                                </form>
                            </motion.div>

                            {/* Driver Details Card */}
                            {driverDetails && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border border-primary-200 p-6 shadow-md"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-primary-900">Driver Details</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white rounded-lg px-3 py-2.5 border border-primary-200">
                                            <p className="text-xs text-text-muted font-medium">Driver Name</p>
                                            <p className="text-sm font-semibold text-text-primary mt-1">{driverDetails.driverName || 'N/A'}</p>
                                        </div>
                                        <div className="bg-white rounded-lg px-3 py-2.5 border border-primary-200">
                                            <p className="text-xs text-text-muted font-medium">Phone</p>
                                            <p className="text-sm font-semibold text-text-primary mt-1">{driverDetails.phone || 'N/A'}</p>
                                        </div>
                                        <div className="bg-white rounded-lg px-3 py-2.5 border border-primary-200">
                                            <p className="text-xs text-text-muted font-medium">Vehicle Type</p>
                                            <p className="text-sm font-semibold text-text-primary mt-1">{driverDetails.vehicleType || vehicleType}</p>
                                        </div>
                                        <div className="bg-white rounded-lg px-3 py-2.5 border border-primary-200">
                                            <p className="text-xs text-text-muted font-medium">Subscription</p>
                                            <p className="text-sm font-semibold text-text-primary mt-1">{driverDetails.subscription || 'None'}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Right Column: Slots Grid */}
                        <div className="lg:col-span-1">
                            <motion.div
                                className="bg-white rounded-lg border border-surface-200 p-6 shadow-md sticky top-6"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <ParkingSquare className="w-5 h-5 text-primary-600" />
                                    <h3 className="text-lg font-semibold text-text-primary">Available Slots</h3>
                                </div>

                                {basement ? (
                                    <div className="space-y-3">
                                        {availableSlots.length > 0 ? (
                                            <>
                                                <div className="text-xs text-text-muted mb-3">
                                                    {availableSlots.filter(s => s.status === 'available').length} available out of {availableSlots.length}
                                                </div>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {availableSlots.map((slot) => (
                                                        <motion.button
                                                            key={slot.id}
                                                            onClick={() => slot.status === 'available' && setSelectedSlot(slot.slotNumber)}
                                                            whileHover={{ scale: slot.status === 'available' ? 1.05 : 1 }}
                                                            className={`p-2 rounded-lg font-semibold text-sm transition-all ${
                                                                slot.status === 'available'
                                                                    ? selectedSlot === slot.slotNumber
                                                                        ? 'bg-success-600 text-white border-2 border-success-700 cursor-pointer'
                                                                        : 'bg-success-100 text-success-700 border border-success-300 hover:bg-success-200 cursor-pointer'
                                                                    : slot.status === 'occupied'
                                                                    ? 'bg-danger-100 text-danger-700 border border-danger-300 cursor-not-allowed'
                                                                    : slot.status === 'reserved'
                                                                    ? 'bg-warning-100 text-warning-700 border border-warning-300 cursor-not-allowed'
                                                                    : 'bg-surface-100 text-text-muted border border-surface-300 cursor-not-allowed'
                                                            }`}
                                                            disabled={slot.status !== 'available'}
                                                        >
                                                            {slot.slotNumber}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                                <div className="mt-4 space-y-2 pt-4 border-t border-surface-200">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded bg-success-500" />
                                                        <span className="text-xs text-text-secondary">Available</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded bg-danger-500" />
                                                        <span className="text-xs text-text-secondary">Occupied</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded bg-warning-500" />
                                                        <span className="text-xs text-text-secondary">Reserved</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded bg-surface-400" />
                                                        <span className="text-xs text-text-secondary">Disabled</span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-6">
                                                <AlertCircle className="w-8 h-8 text-text-muted/30 mx-auto mb-2" />
                                                <p className="text-sm text-text-muted">No slots available</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <MapPin className="w-8 h-8 text-text-muted/30 mx-auto mb-2" />
                                        <p className="text-sm text-text-muted">Select a basement to view slots</p>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="ticket"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg border border-surface-200 overflow-hidden shadow-md"
                    >
                        <div className="bg-gradient-to-r from-success-500 to-success-600 px-6 py-6 text-center">
                            <CheckCircle2 className="w-12 h-12 text-white mx-auto mb-2" />
                            <h2 className="text-2xl font-bold text-white">Ticket Generated!</h2>
                            <p className="text-success-100 text-sm mt-1">Vehicle has been registered successfully for entry</p>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Ticket ID', value: ticket.ticketId },
                                    { label: 'Vehicle Number', value: ticket.vehicleNumber },
                                    { label: 'Vehicle Type', value: ticket.vehicleType },
                                    { label: 'Allocated Slot', value: ticket.slotNumber },
                                    { label: 'Building', value: ticket.building },
                                    { label: 'Basement', value: ticket.basement },
                                ].map((item, i) => (
                                    <div key={i} className="bg-surface-50 rounded-lg px-4 py-3 border border-surface-100">
                                        <p className="text-xs text-text-muted font-medium">{item.label}</p>
                                        <p className="text-sm font-semibold text-text-primary mt-1">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-primary-50 rounded-lg px-4 py-4 border border-primary-100">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock className="w-4 h-4 text-primary-600" />
                                    <p className="text-xs text-primary-600 font-medium">Entry Time</p>
                                </div>
                                <p className="text-sm font-semibold text-primary-900">{formatDateTime(ticket.entryTime)}</p>
                            </div>

                            <Button onClick={handleNewEntry} className="w-full" variant="outlineGray" size="lg">
                                Register New Entry
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Entry;