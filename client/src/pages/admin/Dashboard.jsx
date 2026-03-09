import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, Activity, IndianRupee, ParkingSquare, TrendingUp, Calendar } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SkeletonCard } from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { adminService } from '../../services/adminService';
import { formatCurrency } from '../../utils/helpers';

const statCards = [
    { key: 'totalVehiclesToday', label: 'Total Vehicles Today', icon: Car, color: 'from-primary-500 to-primary-600', change: '+12%', positive: true },
    { key: 'activeSessions', label: 'Active Sessions', icon: Activity, color: 'from-secondary-500 to-secondary-600', change: '+5%', positive: true },
    { key: 'totalRevenue', label: 'Total Revenue', icon: IndianRupee, color: 'from-warning-500 to-warning-600', isCurrency: true, change: '+8%', positive: true },
    { key: 'availableSlots', label: 'Available Slots', icon: ParkingSquare, color: 'from-success-500 to-success-600', change: '20/100', positive: false },
];

const CHART_COLORS = ['#5B7DBF', '#6EDC8C', '#FFC857', '#FF7A7A', '#4CAF50', '#F4A261'];

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await adminService.getDashboardStats();
                if (res.success) setStats(res.data);
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
                    <p className="text-sm text-text-secondary">Welcome back! Here's your parking system overview</p>
                </div>
                <Button variant="outline" icon={Calendar} size="md">
                    Today
                </Button>
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
                                {card.isCurrency ? formatCurrency(value) : typeof value === 'number' ? value.toLocaleString() : value}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Parking Usage Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 bg-white rounded-lg border border-surface-200 p-6 shadow-md"
                >
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-lg font-semibold text-text-primary">Parking Usage Trend</h3>
                            <p className="text-xs text-text-muted mt-1">Vehicles parked per hour</p>
                        </div>
                        <span className="text-xs font-medium text-text-muted">Last 24 Hours</span>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={stats?.hourlyUsage || []}>
                            <defs>
                                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#D9E1F2" vertical={false} />
                            <XAxis dataKey="hour" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: '1px solid #E5E7EB',
                                    fontSize: '12px',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="#5B7DBF"
                                strokeWidth={2}
                                fill="url(#colorUsage)"
                                isAnimationActive={true}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Revenue Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-lg border border-surface-200 p-6 shadow-md"
                >
                    <div className="mb-5">
                        <h3 className="text-lg font-semibold text-text-primary">Revenue by Vehicle Type</h3>
                        <p className="text-xs text-text-muted mt-1">Total earnings breakdown</p>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie
                                data={stats?.revenueByType || []}
                                dataKey="revenue"
                                nameKey="type"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={55}
                                paddingAngle={2}
                            >
                                {(stats?.revenueByType || []).map((_, idx) => (
                                    <Cell key={idx} fill={CHART_COLORS[idx]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(val) => formatCurrency(val)}
                                contentStyle={{ borderRadius: '8px', border: '1px solid #D9E1F2', fontSize: '12px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Basement Occupancy */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-lg border border-surface-200 p-6 shadow-md"
            >
                <div className="mb-5">
                    <h3 className="text-lg font-semibold text-text-primary">Basement Occupancy</h3>
                    <p className="text-xs text-text-muted mt-1">Current parking slot usage by basement</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats?.basementOccupancy || []} barGap={4} margin={{ bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#D9E1F2" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: '1px solid #D9E1F2', fontSize: '12px' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Bar dataKey="occupied" fill="#6EDC8C" name="Occupied" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="available" fill="#D9E1F2" name="Available" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    );
};

export default Dashboard;
