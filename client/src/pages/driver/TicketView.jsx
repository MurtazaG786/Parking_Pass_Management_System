// driver/TicketView.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Ticket, 
  Clock, 
  Car, 
  MapPin,
  QrCode,
  Download,
  Printer,
  Share2,
  Calendar,
  Building2,
  Hash
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { driverService } from '../../services/driverService';
import { PageLoader, EmptyState } from '../../components/common/Loader';
import { formatDateTime } from '../../utils/helpers';

const TicketView = () => {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await driverService.getActiveTicket();
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

    if (!ticket) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
                        My Ticket
                    </h1>
                    <EmptyState 
                        icon={Ticket} 
                        title="No active ticket" 
                        description="You don't have an active parking ticket." 
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            Parking Ticket
                        </h1>
                        <p className="text-gray-500 mt-1">Your active parking session details</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white transition-colors">
                            <Printer className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white transition-colors">
                            <Download className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white transition-colors">
                            <Share2 className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Ticket Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl opacity-5 pattern-grid" />
                    
                    {/* Main Ticket */}
                    <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                        {/* Ticket Header */}
                        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6 text-center relative">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                                <div className="absolute -left-4 -top-4 w-24 h-24 bg-white rounded-full" />
                                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white rounded-full" />
                            </div>
                            
                            <Ticket className="w-12 h-12 text-white mx-auto mb-3 relative z-10" />
                            <h2 className="text-2xl font-bold text-white mb-1 relative z-10">Parking Ticket</h2>
                            <p className="text-primary-100 text-sm relative z-10">ParkEase • Digital Parking Solution</p>
                            
                            {/* Ticket ID */}
                            <div className="mt-4 inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                                <p className="text-xs text-indigo-200">Ticket ID</p>
                                <p className="text-lg font-bold text-white font-mono">{ticket.ticketId}</p>
                            </div>
                        </div>

                        {/* Ticket Content */}
                        <div className="p-8">
                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="col-span-2 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-4 border border-indigo-200/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-200 rounded-lg flex items-center justify-center">
                                            <Car className="w-5 h-5 text-indigo-700" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-indigo-600">Vehicle</p>
                                            <p className="text-lg font-bold text-indigo-900">
                                                {ticket.vehicleNumber} • {ticket.vehicleType}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Location</p>
                                            <p className="text-sm font-semibold text-gray-900">{ticket.building}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <Building2 className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Basement</p>
                                            <p className="text-sm font-semibold text-gray-900">{ticket.basement}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <Ticket className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Slot Number</p>
                                            <p className="text-sm font-semibold text-gray-900">{ticket.slotNumber}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Entry Time</p>
                                            <p className="text-sm font-semibold text-gray-900">{formatDateTime(ticket.entryTime)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* QR Code Section */}
                            <div className="relative">
                                {/* Perforated Edge */}
                                <div className="absolute -top-4 left-0 right-0 flex justify-around">
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className="w-2 h-2 bg-gray-200 rounded-full" />
                                    ))}
                                </div>

                                <div className="border-t-2 border-dashed border-gray-200 pt-8">
                                    <div className="flex flex-col items-center">
                                        <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                                            <QRCode 
                                                value={ticket.qrData || JSON.stringify({
                                                    id: ticket.ticketId,
                                                    vehicle: ticket.vehicleNumber,
                                                    slot: ticket.slotNumber,
                                                    time: ticket.entryTime
                                                })} 
                                                size={180}
                                                level="H"
                                                className="rounded-lg"
                                            />
                                        </div>
                                        
                                        <div className="mt-4 text-center">
                                            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                                                <QrCode className="w-3 h-3" />
                                                Scan this QR code at entry and exit gates
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Valid for one-time use only
                                            </p>
                                        </div>

                                        {/* Additional Info */}
                                        <div className="mt-6 w-full bg-gray-50 rounded-xl p-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Issued At</span>
                                                <span className="font-medium">{formatDateTime(ticket.issuedAt || ticket.entryTime)}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm mt-2">
                                                <span className="text-gray-600">Valid Until</span>
                                                <span className="font-medium text-orange-600">{formatDateTime(ticket.validUntil)}</span>
                                            </div>
                                        </div>

                                        {/* Terms */}
                                        <p className="text-xs text-gray-400 text-center mt-4">
                                            This ticket is electronically generated and valid with QR code verification.
                                            Please keep your ticket handy during your parking duration.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TicketView;