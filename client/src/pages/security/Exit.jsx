import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Search, Clock, IndianRupee, CheckCircle2, Car } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { securityService } from '../../services/securityService';
import { formatDateTime, formatCurrency } from '../../utils/helpers';

const Exit = () => {
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [vehicleData, setVehicleData] = useState(null);
    const [paymentDone, setPaymentDone] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleSearch = async () => {
        if (!vehicleNumber.trim()) return;
        setLoading(true);
        setVehicleData(null);
        setPaymentDone(false);
        try {
            const res = await securityService.searchVehicle(vehicleNumber);
            if (res.success) setVehicleData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        setProcessing(true);
        try {
            const res = await securityService.processPayment(vehicleData.ticketId);
            if (res.success) setPaymentDone(true);
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-neutral-900">Vehicle Exit</h1>
                <p className="text-sm text-neutral-600 mt-1">Process vehicle exit and collect payment</p>
            </div>

            <div className="max-w-2xl mx-auto">
                {/* Search */}
                <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-6 shadow-card">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-lg bg-danger-50 flex items-center justify-center">
                            <LogOut className="w-5 h-5 text-danger-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-neutral-900">Search Parked Vehicle</h2>
                    </div>
                    <div className="flex gap-2">
                        <Input
                            icon={Car}
                            placeholder="MH-12-AB-1234"
                            value={vehicleNumber}
                            onChange={(e) => setVehicleNumber(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button onClick={handleSearch} loading={loading} icon={Search} size="lg">
                            Search
                        </Button>
                    </div>
                </div>

                <AnimatePresence>
                    {vehicleData && !paymentDone && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-white rounded-lg border border-neutral-200 p-6 shadow-card"
                        >
                            <h3 className="text-base font-semibold text-neutral-900 mb-5">Parking Details</h3>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {[
                                    { label: 'Vehicle Number', value: vehicleData.vehicleNumber, icon: Car },
                                    { label: 'Slot', value: vehicleData.slotNumber },
                                    { label: 'Building', value: vehicleData.building },
                                    { label: 'Basement', value: vehicleData.basement },
                                ].map((item, i) => (
                                    <div key={i} className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-100">
                                        <p className="text-xs text-neutral-500 font-medium">{item.label}</p>
                                        <p className="text-sm font-semibold text-neutral-900 mt-1">{item.value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-6">
                                <div className="bg-primary-50 rounded-lg px-4 py-4 border border-primary-100 text-center">
                                    <Clock className="w-4 h-4 text-primary-500 mx-auto mb-2" />
                                    <p className="text-xs text-primary-600 font-medium">Entry Time</p>
                                    <p className="text-xs font-semibold text-primary-900 mt-1.5">{formatDateTime(vehicleData.entryTime)}</p>
                                </div>
                                <div className="bg-warning-50 rounded-lg px-4 py-4 border border-warning-100 text-center">
                                    <Clock className="w-4 h-4 text-warning-500 mx-auto mb-2" />
                                    <p className="text-xs text-warning-600 font-medium">Duration</p>
                                    <p className="text-lg font-bold text-warning-900 mt-1.5">{vehicleData.duration}</p>
                                </div>
                                <div className="bg-success-50 rounded-lg px-4 py-4 border border-success-100 text-center">
                                    <IndianRupee className="w-4 h-4 text-success-500 mx-auto mb-2" />
                                    <p className="text-xs text-success-600 font-medium">Charge</p>
                                    <p className="text-lg font-bold text-success-900">{formatCurrency(vehicleData.charge)}</p>
                                </div>
                            </div>

                            <Button onClick={handlePayment} loading={processing} className="w-full" size="lg" variant="success" icon={IndianRupee}>
                                Process Payment — {formatCurrency(vehicleData.charge)}
                            </Button>
                        </motion.div>
                    )}

                    {paymentDone && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-card"
                        >
                            <div className="bg-gradient-to-r from-success-500 to-success-600 px-6 py-8 text-center">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
                                    <CheckCircle2 className="w-16 h-16 text-white mx-auto mb-3" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
                                <p className="text-success-100 text-sm mt-1">Vehicle is now cleared for exit from the parking facility</p>
                            </div>
                            <div className="p-6 text-center">
                                <Button onClick={() => { setVehicleData(null); setPaymentDone(false); setVehicleNumber(''); }} variant="outlineGray" size="lg">
                                    Process Another Exit
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Exit;
