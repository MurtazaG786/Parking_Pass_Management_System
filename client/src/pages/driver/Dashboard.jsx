// driver/Dashboard.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Clock, 
  History, 
  CreditCard, 
  MapPin, 
  ArrowRight,
  Calendar,
  TrendingUp,
  Shield,
  Bell,
  IndianRupee,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { driverService } from '../../services/driverService';
import Button from '../../components/common/Button';
import { PageLoader, ErrorState } from '../../components/common/Loader';
import { formatDateTime, formatCurrency, getStatusClasses } from '../../utils/helpers';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await driverService.getDashboard();
                if (res.success) setData(res.data);
            } catch (err) {
                setError('Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <PageLoader />;
    if (error) return <ErrorState message={error} />;

    const stats = [
        { label: 'Total Visits', value: data?.totalVisits || 0, icon: TrendingUp, color: 'from-primary-500 to-primary-600' },
        { label: 'Total Spent', value: formatCurrency(data?.totalSpent || 0), icon: CreditCard, color: 'from-secondary-500 to-secondary-600' },
        { label: 'Active Sessions', value: data?.activeParking ? 1 : 0, icon: Clock, color: 'from-success-500 to-success-600' },
        { label: 'Subscription', value: data?.subscription ? 'Active' : 'None', icon: Shield, color: 'from-warning-500 to-warning-600' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
                    <p className="text-sm text-text-secondary mt-1">Welcome back! Here's your parking overview</p>
                </div>
                <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors relative">
                    <Bell className="w-5 h-5 text-neutral-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full animate-pulse"></span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg border border-surface-200 p-5 shadow-md hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-text-secondary font-medium">{stat.label}</p>
                                <p className="text-lg font-bold text-text-primary mt-0.5">{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Parking Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-white rounded-lg border border-surface-200 shadow-md overflow-hidden"
                >
                    <div className="px-6 py-4 border-b border-surface-200 flex items-center justify-between bg-surface-50">
                        <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                                <Car className="w-4 h-4 text-primary-600" />
                            </div>
                            Active Parking Session
                        </h2>
                        {data?.activeParking && (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-success-100 text-success-700 text-xs font-semibold rounded-full">
                                <div className="w-1.5 h-1.5 bg-success-500 rounded-full animate-pulse" />
                                Active Now
                            </span>
                        )}
                    </div>
                    
                    {data?.activeParking ? (
                        <div className="p-6">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                                {[
                                    { label: 'Vehicle Number', value: data.activeParking.vehicleNumber, icon: Car },
                                    { label: 'Slot Number', value: data.activeParking.slotNumber, icon: MapPin },
                                    { label: 'Building', value: data.activeParking.building, icon: MapPin },
                                    { label: 'Basement', value: data.activeParking.basement, icon: MapPin },
                                ].map((item, i) => (
                                    <div key={i} className="bg-surface-50 rounded-lg p-3 border border-surface-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <item.icon className="w-3 h-3 text-text-muted" />
                                            <p className="text-xs text-text-muted font-medium">{item.label}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-text-primary">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg border border-primary-100 mb-5">
                                <Clock className="w-4 h-4 text-primary-600 flex-shrink-0" />
                                <span className="text-sm text-neutral-700">
                                    Parked since <span className="font-semibold text-primary-700">{formatDateTime(data.activeParking.entryTime)}</span>
                                </span>
                            </div>
                            
                            <div className="flex gap-3">
                                <Button 
                                    size="lg" 
                                    onClick={() => navigate('/driver/tickets')}
                                    className="flex-1"
                                >
                                    View Ticket
                                </Button>
                                <Button 
                                    size="lg" 
                                    variant="success"
                                    onClick={() => navigate('/driver/payments')}
                                    className="flex-1"
                                    icon={IndianRupee}
                                >
                                    Pay & Exit
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Car className="w-8 h-8 text-neutral-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">No Active Parking</h3>
                            <p className="text-sm text-text-secondary mb-6">You don't have any active parking session right now</p>
                            <Button 
                                size="lg" 
                                onClick={() => navigate('/driver/slots')}
                            >
                                Find Parking
                            </Button>
                        </div>
                    )}
                </motion.div>

                {/* Subscription Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-lg border border-surface-200 shadow-md overflow-hidden"
                >
                    <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
                        <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-secondary-100 flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-secondary-600" />
                            </div>
                            Subscription
                        </h2>
                    </div>
                    
                    {data?.subscription ? (
                        <div className="p-6">
                            <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg p-4 text-white mb-4">
                                <p className="text-xs text-secondary-200 font-medium">Current Plan</p>
                                <p className="text-xl font-bold mt-1">{data.subscription.planName}</p>
                                <div className="flex items-center gap-2 mt-3 text-sm">
                                    <Calendar className="w-4 h-4" />
                                    {/* <p>Valid till {new Date(data.subscription.expiryDate).toLocaleDateString()}</p> */}
                                    <p>Valid till 23 January,2027</p>
                                </div>
                            </div>
                            
                            <div className="space-y-3 mb-5">
                                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                                    <MapPin className="w-4 h-4 text-neutral-400" />
                                    <span className="text-sm text-neutral-600">Reserved Parking</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                                    <Check className="w-4 h-4 text-success-500" />
                                    <span className="text-sm text-neutral-600">All Benefits Active</span>
                                </div>
                            </div>
                            
                            <Button 
                                variant="outlineGray" 
                                className="w-full"
                                onClick={() => navigate('/driver/subscriptions')}
                            >
                                Manage Subscription
                            </Button>
                        </div>
                    ) : (
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="w-8 h-8 text-neutral-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Active Subscription</h3>
                            <p className="text-sm text-neutral-600 mb-6">Subscribe to get exclusive benefits and discounts</p>
                            <Button 
                                size="lg"
                                onClick={() => navigate('/driver/subscriptions')}
                            >
                                View Plans
                            </Button>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Parking History */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg border border-neutral-200 shadow-card overflow-hidden"
            >
                <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                            <History className="w-4 h-4 text-primary-600" />
                        </div>
                        Recent Parking History
                    </h2>
                    <button 
                        onClick={() => navigate('/driver/history')}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                    >
                        View All
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="divide-y divide-neutral-100">
                    {data?.parkingHistory?.slice(0, 5).map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="px-6 py-4 hover:bg-neutral-50 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                                        <Car className="w-5 h-5 text-neutral-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-neutral-900">
                                            {item.building} • Slot {item.slot}
                                        </p>
                                        <p className="text-xs text-neutral-600 mt-1">
                                            {item.date} • {item.duration}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-neutral-900">{formatCurrency(item.charge)}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusClasses(item.status)}`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;