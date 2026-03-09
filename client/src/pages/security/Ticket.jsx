import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ticket as TicketIcon, Clock, Car, MapPin } from 'lucide-react';
import QRCode from 'react-qr-code';
import { securityService } from '../../services/securityService';
import { PageLoader } from '../../components/common/Loader';
import { formatDateTime } from '../../utils/helpers';

const Ticket = () => {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                // Simulate getting the last generated ticket
                const res = await securityService.generateTicket({
                    vehicleNumber: 'MH-12-AB-1234',
                    vehicleType: '4W',
                    building: 'Tower A',
                    basement: 'B1',
                });
                if (res.success) setTicket(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <PageLoader />;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Parking Ticket</h1>
                <p className="text-sm text-gray-500 mt-0.5">View and print parking tickets</p>
            </div>

            {ticket && (
                <div className="max-w-md mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5 text-center">
                            <TicketIcon className="w-8 h-8 text-white mx-auto mb-2" />
                            <h2 className="text-lg font-bold text-white">Parking Ticket</h2>
                            <p className="text-primary-200 text-xs mt-0.5">ParkEase Management System</p>
                        </div>

                        {/* Ticket Details */}
                        <div className="p-6">
                            <div className="text-center mb-5">
                                <p className="text-xs text-gray-500">Ticket ID</p>
                                <p className="text-lg font-bold text-gray-900 font-mono">{ticket.ticketId}</p>
                            </div>

                            <div className="space-y-3 mb-6">
                                {[
                                    { icon: Car, label: 'Vehicle', value: `${ticket.vehicleNumber} (${ticket.vehicleType})` },
                                    { icon: MapPin, label: 'Location', value: `${ticket.building} — ${ticket.basement}` },
                                    { icon: TicketIcon, label: 'Slot', value: ticket.slotNumber },
                                    { icon: Clock, label: 'Entry', value: formatDateTime(ticket.entryTime) },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-lg">
                                        <item.icon className="w-4 h-4 text-gray-400" />
                                        <div className="flex-1">
                                            <span className="text-xs text-gray-500">{item.label}</span>
                                            <p className="text-sm font-medium text-gray-900">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* QR Code */}
                            <div className="flex flex-col items-center py-4 border-t border-dashed border-gray-200">
                                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                                    <QRCode value={ticket.qrData || 'PARKEASE'} size={140} />
                                </div>
                                <p className="text-xs text-gray-400 mt-3">Scan for verification</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Ticket;
