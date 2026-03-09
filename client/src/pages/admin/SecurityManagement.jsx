import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Plus, Pencil, Trash2, Phone, Mail, Users } from 'lucide-react';
import { Dropdown } from 'primereact/dropdown';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { PageLoader, EmptyState, ErrorState } from '../../components/common/Loader';
import { getStatusClasses } from '../../utils/helpers';

const SecurityManagement = () => {
    const [guards, setGuards] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', assignedBuilding: '', shift: 'Day' });
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [guardRes, buildingRes] = await Promise.all([
                adminService.getSecurityGuards(),
                adminService.getBuildings(),
            ]);
            if (guardRes.success) setGuards(guardRes.data);
            if (buildingRes.success) setBuildings(buildingRes.data);
        } catch (err) {
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const buildingOptions = buildings.map(b => ({ label: b.name, value: b.name }));
    const shiftOptions = [{ label: 'Day', value: 'Day' }, { label: 'Night', value: 'Night' }];

    const stats = {
        total: guards.length,
        onDuty: guards.filter(g => g.status === 'On Duty').length,
        leave: guards.filter(g => g.status === 'Leave').length,
    };

    const openCreate = () => {
        setEditItem(null);
        setForm({ name: '', email: '', phone: '', assignedBuilding: '', shift: 'Day' });
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditItem(item);
        setForm({ name: item.name, email: item.email, phone: item.phone, assignedBuilding: item.assignedBuilding, shift: item.shift });
        setModalOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (editItem) {
                await adminService.updateSecurityGuard(editItem.id, form);
                setGuards(prev => prev.map(g => g.id === editItem.id ? { ...g, ...form } : g));
            } else {
                const res = await adminService.createSecurityGuard(form);
                if (res.success) setGuards(prev => [...prev, res.data]);
            }
            setModalOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await adminService.deleteSecurityGuard(deleteModal.id);
            setGuards(prev => prev.filter(g => g.id !== deleteModal.id));
            setDeleteModal(null);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <PageLoader />;
    if (error) return <ErrorState message={error} onRetry={fetchData} />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Security Management</h1>
                    <p className="text-sm text-neutral-600 mt-1">Manage your security team and assignments</p>
                </div>
                <Button icon={Plus} size="lg" onClick={openCreate}>Add Security Guard</Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Guards', value: stats.total, color: 'from-primary-500 to-primary-600' },
                    { label: 'On Duty', value: stats.onDuty, color: 'from-success-500 to-success-600' },
                    { label: 'Leave', value: stats.leave, color: 'from-warning-500 to-warning-600' },
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-lg border border-neutral-200 p-4 shadow-card"
                    >
                        <p className="text-xs text-neutral-600 font-medium mb-2">{stat.label}</p>
                        <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Content */}
            {guards.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="No security guards added"
                    description="Start by adding security guards to manage your parking facilities"
                    action={<Button onClick={openCreate} icon={Plus}>Add First Guard</Button>}
                />
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-lg border border-neutral-200 shadow-card overflow-hidden"
                >
                    {/* Table Header */}
                    <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-neutral-50 border-b border-neutral-200">
                        <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Guard</div>
                        <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Contact</div>
                        <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Building</div>
                        <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Shift</div>
                        <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Status</div>
                    </div>

                    {/* Table Rows */}
                    <div className="divide-y divide-neutral-200">
                        {guards.map((g, idx) => (
                            <motion.div
                                key={g.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="grid grid-cols-5 gap-4 px-6 py-4 items-center hover:bg-neutral-50 transition-colors group"
                            >
                                {/* Guard Name */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                                        <ShieldCheck className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-neutral-900 truncate">{g.name}</p>
                                        <p className="text-xs text-neutral-500">ID: {g.guardId}</p>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                                        <Mail className="w-3.5 h-3.5 text-neutral-400" />
                                        <span className="truncate">{g.email}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                                        <Phone className="w-3.5 h-3.5 text-neutral-400" />
                                        <span>{g.phone}</span>
                                    </div>
                                </div>

                                {/* Building */}
                                <div>
                                    <span className="text-sm font-medium text-neutral-900">{g.assignedBuilding}</span>
                                </div>

                                {/* Shift */}
                                <div>
                                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">
                                        {g.shift} Shift
                                    </span>
                                </div>

                                {/* Status & Actions */}
                                <div className="flex items-center justify-between">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                        g.status === 'On Duty'
                                            ? 'bg-success-100 text-success-700'
                                            : g.status === 'Leave'
                                                ? 'bg-warning-100 text-warning-700'
                                                : 'bg-neutral-100 text-neutral-700'
                                    }`}>
                                        {g.status}
                                    </span>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openEdit(g)}
                                            className="p-1.5 rounded-lg hover:bg-primary-50 text-neutral-400 hover:text-primary-600 transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteModal(g)}
                                            className="p-1.5 rounded-lg hover:bg-danger-50 text-neutral-400 hover:text-danger-600 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Add/Edit Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Security Guard' : 'Add Security Guard'} size="md">
                <div className="space-y-4">
                    <Input
                        label="Full Name"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Ramesh Kumar"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Email"
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="guard@parkease.com"
                        />
                        <Input
                            label="Phone"
                            required
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="9876543210"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">Building</label>
                            <Dropdown
                                value={form.assignedBuilding}
                                onChange={(e) => setForm({ ...form, assignedBuilding: e.value })}
                                options={buildingOptions}
                                placeholder="Select Building"
                                className="w-full"
                                pt={{
                                    root: { className: 'w-full border border-neutral-300 rounded-lg bg-white' },
                                    input: { className: 'px-3.5 py-2.5 text-sm text-neutral-900' },
                                    item: { className: 'text-sm py-2' },
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">Shift</label>
                            <Dropdown
                                value={form.shift}
                                onChange={(e) => setForm({ ...form, shift: e.value })}
                                options={shiftOptions}
                                className="w-full"
                                pt={{
                                    root: { className: 'w-full border border-neutral-300 rounded-lg bg-white' },
                                    input: { className: 'px-3.5 py-2.5 text-sm text-neutral-900' },
                                    item: { className: 'text-sm py-2' },
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200">
                        <Button variant="outlineGray" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} loading={saving}>{editItem ? 'Update Guard' : 'Add Guard'}</Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Remove Guard" size="xs">
                <div className="space-y-4">
                    <p className="text-sm text-neutral-600">
                        Are you sure you want to remove <strong>{deleteModal?.name}</strong> from the security team? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
                        <Button variant="outlineGray" onClick={() => setDeleteModal(null)}>Cancel</Button>
                        <Button variant="danger" onClick={handleDelete}>Remove Guard</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default SecurityManagement;
