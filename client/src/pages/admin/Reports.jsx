import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, Calendar } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import { PageLoader, ErrorState } from '../../components/common/Loader';
import { formatCurrency } from '../../utils/helpers';

const Reports = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState('week');

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await adminService.getReports(dateRange);
            if (res.success) setData(res.data);
        } catch (err) {
            setError('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [dateRange]);

    if (loading) return <PageLoader />;
    if (error) return <ErrorState message={error} onRetry={fetchData} />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Reports</h1>
                    <p className="text-sm text-neutral-600 mt-1">Revenue and vehicle analytics dashboard</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-neutral-100 rounded-lg p-1 border border-neutral-200">
                        {['week', 'month', 'year'].map(range => (
                            <button
                                key={range}
                                onClick={() => setDateRange(range)}
                                className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${dateRange === range ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200' : 'text-neutral-600 hover:text-neutral-900'
                                    }`}
                            >
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                            </button>
                        ))}
                    </div>
                    <Button variant="outlineGray" size="md" icon={Download}>Export</Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Revenue', value: formatCurrency(data?.dailyRevenue?.reduce((s, d) => s + d.revenue, 0) || 0), color: 'text-success-600', bg: 'bg-success-50' },
                    { label: 'Total 2W Vehicles', value: data?.vehicleCount?.reduce((s, d) => s + d.twoWheeler, 0)?.toLocaleString() || '0', color: 'text-primary-600', bg: 'bg-primary-50' },
                    { label: 'Total 4W Vehicles', value: data?.vehicleCount?.reduce((s, d) => s + d.fourWheeler, 0)?.toLocaleString() || '0', color: 'text-violet-600', bg: 'bg-violet-50' },
                ].map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-lg border border-neutral-200 p-6 shadow-card"
                    >
                        <p className="text-sm text-neutral-600 mb-2 font-medium">{card.label}</p>
                        <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Revenue Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg border border-neutral-200 p-6 shadow-card"
            >
                <h3 className="text-base font-semibold text-neutral-900 mb-5">Daily Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data?.dailyRevenue || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(val) => formatCurrency(val)} contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px', backgroundColor: '#F9FAFB' }} />
                        <Bar dataKey="revenue" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Vehicle Count Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg border border-neutral-200 p-6 shadow-card"
            >
                <h3 className="text-base font-semibold text-neutral-900 mb-5">Vehicle Count Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data?.vehicleCount || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px', backgroundColor: '#F9FAFB' }} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#6B7280' }} />
                        <Line type="monotone" dataKey="twoWheeler" stroke="#2563EB" name="2 Wheeler" strokeWidth={2.5} dot={{ r: 4, fill: '#2563EB' }} />
                        <Line type="monotone" dataKey="fourWheeler" stroke="#7C3AED" name="4 Wheeler" strokeWidth={2.5} dot={{ r: 4, fill: '#7C3AED' }} />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    );
};

export default Reports;
