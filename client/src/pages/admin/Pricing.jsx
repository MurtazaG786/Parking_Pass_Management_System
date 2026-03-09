import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Pencil } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { PageLoader, ErrorState } from '../../components/common/Loader';
import { formatCurrency } from '../../utils/helpers';

const Pricing = () => {
    const [pricing, setPricing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({ hourlyRate: '', dailyRate: '', monthlyRate: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await adminService.getPricing();
                if (res.success) setPricing(res.data);
            } catch (err) {
                setError('Failed to load pricing');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const openEdit = (item) => {
        setEditItem(item);
        setForm({ hourlyRate: item.hourlyRate, dailyRate: item.dailyRate, monthlyRate: item.monthlyRate });
        setModalOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await adminService.updatePricing(editItem.id, form);
            setPricing(prev => prev.map(p => p.id === editItem.id ? { ...p, ...form } : p));
            setModalOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <PageLoader />;
    if (error) return <ErrorState message={error} />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-neutral-900">Pricing Configuration</h1>
                <p className="text-sm text-neutral-600 mt-1">Manage parking rates by vehicle type</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pricing.map((p, idx) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -3 }}
                        className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
                    >
                        <div className={`px-6 py-5 bg-gradient-to-r ${idx === 0 ? 'from-primary-500 to-primary-600' : 'from-violet-500 to-violet-600'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm">
                                        <span className="text-2xl">{idx === 0 ? '🏍️' : '🚗'}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{p.vehicleType}</h3>
                                        <span className={`text-xs px-2.5 py-1 rounded-full inline-block mt-1 ${p.status === 'active' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-600'}`}>
                                            {p.status === 'active' ? '✓ Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={() => openEdit(p)} className="p-2 rounded-lg bg-white/15 hover:bg-white/25 transition-colors backdrop-blur-sm">
                                    <Pencil className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                                    <p className="text-xs text-neutral-500 font-medium mb-2">Hourly</p>
                                    <p className="text-xl font-bold text-neutral-900">{formatCurrency(p.hourlyRate)}</p>
                                </div>
                                <div className="text-center p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                                    <p className="text-xs text-neutral-500 font-medium mb-2">Daily</p>
                                    <p className="text-xl font-bold text-neutral-900">{formatCurrency(p.dailyRate)}</p>
                                </div>
                                <div className="text-center p-4 bg-primary-50 rounded-xl border border-primary-100">
                                    <p className="text-xs text-primary-600 font-medium mb-2">Monthly</p>
                                    <p className="text-xl font-bold text-primary-700">{formatCurrency(p.monthlyRate)}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Edit Pricing — ${editItem?.vehicleType}`} size="md">
                <div className="space-y-4">
                    <Input required label="Hourly Rate (₹)" type="number" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: Number(e.target.value) })} placeholder="30" />
                    <Input required label="Daily Rate (₹)" type="number" value={form.dailyRate} onChange={(e) => setForm({ ...form, dailyRate: Number(e.target.value) })} placeholder="200" />
                    <Input required label="Monthly Rate (₹)" type="number" value={form.monthlyRate} onChange={(e) => setForm({ ...form, monthlyRate: Number(e.target.value) })} placeholder="3000" />
                    <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200">
                        <Button variant="outlineGray" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} loading={saving}>Update Pricing</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Pricing;
