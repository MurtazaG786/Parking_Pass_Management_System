import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn, LogOut, ShieldCheck, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { securityService } from '../../services/securityService';
import { SkeletonCard } from '../../components/common/Loader';
import { formatCurrency } from '../../utils/helpers';

const statCards = [
    { key: 'totalEntriesDay', label: 'Entries Today', icon: LogIn, color: 'from-primary-500 to-primary-600', change: '+8%', positive: true },
    { key: 'totalExitsDay', label: 'Exits Today', icon: LogOut, color: 'from-warning-500 to-warning-600', change: '+5%', positive: true },
    { key: 'pendingVerifications', label: 'Pending Verifications', icon: ShieldCheck, color: 'from-danger-500 to-danger-600', change: '12 pending', positive: false },
    { key: 'activeVehicles', label: 'Active Vehicles', icon: AlertCircle, color: 'from-success-500 to-success-600', change: '45/100', positive: false },
];

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await securityService.getDashboardStats();
                if (res.success) {
                    setStats(res.data?.stats || {});
                    setRecentActivities(res.data?.activities || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary mb-1">Dashboard</h1>
                    <p className="text-sm text-text-secondary">Welcome! Here's your security operations overview</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, idx) => {
                    const Icon = card.icon;
                    const value = stats?.[card.key] ?? 0;
                    return (
                        <motion.div
                            key={card.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            whileHover={{ y: -4 }}
                            className="bg-white rounded-lg border border-surface-200 p-5 shadow-md hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center shadow-sm`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                {card.positive && (
                                    <div className="flex items-center gap-1 text-xs font-semibold text-success-600 bg-success-50 px-2.5 py-1 rounded-full">
                                        <TrendingUp className="w-3 h-3" />
                                        {card.change}
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-text-secondary font-medium mb-1.5">{card.label}</p>
                            <p className="text-2xl font-bold text-text-primary">
                                {typeof value === 'number' ? value.toLocaleString() : value}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Recent Activities */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg border border-surface-200 p-6 shadow-md"
            >
                <div className="mb-5">
                    <h3 className="text-lg font-semibold text-text-primary">Recent Activities</h3>
                    <p className="text-xs text-text-muted mt-1">Latest vehicle entries and exits</p>
                </div>
                
                {recentActivities && recentActivities.length > 0 ? (
                    <div className="space-y-3">
                        {recentActivities.slice(0, 6).map((activity, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-center justify-between p-3 bg-surface-50 rounded-lg border border-surface-100 hover:bg-surface-100 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                        activity.type === 'entry' ? 'bg-success-100' : 'bg-warning-100'
                                    }`}>
                                        {activity.type === 'entry' ? (
                                            <LogIn className={`w-5 h-5 ${activity.type === 'entry' ? 'text-success-600' : 'text-warning-600'}`} />
                                        ) : (
                                            <LogOut className={`w-5 h-5 ${activity.type === 'exit' ? 'text-warning-600' : 'text-success-600'}`} />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-text-primary">{activity.vehicleNumber}</p>
                                        <p className="text-xs text-text-muted">{activity.ticketId}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-text-primary">{activity.type === 'entry' ? 'Entry' : 'Exit'}</p>
                                    <p className="text-xs text-text-muted">{new Date(activity.timestamp).toLocaleTimeString()}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Clock className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
                        <p className="text-sm text-text-secondary">No recent activities</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Dashboard;
