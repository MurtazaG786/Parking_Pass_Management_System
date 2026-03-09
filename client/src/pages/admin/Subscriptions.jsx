import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Plus, Pencil, Users, Check } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { PageLoader, EmptyState, ErrorState } from '../../components/common/Loader';
import { formatCurrency } from '../../utils/helpers';

const Subscriptions = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({ planName: '', vehicleType: '', duration: '', price: '', features: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await adminService.getSubscriptions();
                if (res.success) setPlans(res.data);
            } catch (err) {
                setError('Failed to load subscriptions');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const openCreate = () => {
        setEditItem(null);
        setForm({ planName: '', vehicleType: '', duration: '', price: '', features: '' });
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditItem(item);
        setForm({ planName: item.planName, vehicleType: item.vehicleType, duration: item.duration, price: item.price, features: item.features?.join(', ') || '' });
        setModalOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = { ...form, features: form.features.split(',').map(f => f.trim()), price: Number(form.price) };
            if (editItem) {
                await adminService.updateSubscription(editItem.id, payload);
                setPlans(prev => prev.map(p => p.id === editItem.id ? { ...p, ...payload } : p));
            } else {
                const res = await adminService.createSubscription(payload);
                if (res.success) setPlans(prev => [...prev, res.data]);
            }
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Subscription Plans</h1>
                    <p className="text-sm text-neutral-600 mt-1">Manage parking subscription plans and pricing</p>
                </div>
                <Button icon={Plus} onClick={openCreate} size="lg">Add Plan</Button>
            </div>

            {plans.length === 0 ? (
                <EmptyState icon={CreditCard} title="No plans created" description="Start by creating your first subscription plan." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -3 }}
                            className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-card hover:shadow-card-hover transition-shadow flex flex-col"
                        >
                            <div className="p-6 flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-base font-bold text-neutral-900">{plan.planName}</h3>
                                        <p className="text-xs text-neutral-600 mt-1">{plan.vehicleType} • {plan.duration}</p>
                                    </div>
                                    <button onClick={() => openEdit(plan)} className="p-1.5 rounded-lg hover:bg-primary-50 text-neutral-400 hover:text-primary-600 transition-colors">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="mb-5">
                                    <span className="text-3xl font-bold text-neutral-900">{formatCurrency(plan.price)}</span>
                                    <span className="text-sm text-neutral-500 ml-1">/{plan.duration}</span>
                                </div>

                                <ul className="space-y-2.5">
                                    {plan.features?.map((f, i) => (
                                        <li key={i} className="flex items-center gap-2.5 text-sm text-neutral-700">
                                            <div className="w-5 h-5 rounded-full bg-success-100 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-3 h-3 text-success-600" />
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                                    <Users className="w-3.5 h-3.5" />
                                    <span className="font-medium">{plan.subscribers} subscribers</span>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${plan.status === 'active' ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-600'}`}>
                                    {plan.status === 'active' ? '✓ Active' : 'Inactive'}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Plan' : 'Create Plan'} size="md">
                <div className="space-y-4">
                    <Input required label="Plan Name" value={form.planName} onChange={(e) => setForm({ ...form, planName: e.target.value })} placeholder="Premium 4W Monthly" />
                    <div className="grid grid-cols-2 gap-4">
                        <Input required label="Vehicle Type" value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })} placeholder="4W" />
                        <Input required label="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="30 days" />
                    </div>
                    <Input required label="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="3000" />
                    <Input required label="Features (comma-separated)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Reserved slot, Priority parking" />
                    <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200">
                        <Button variant="outlineGray" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} loading={saving}>{editItem ? 'Update Plan' : 'Create Plan'}</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Subscriptions;
