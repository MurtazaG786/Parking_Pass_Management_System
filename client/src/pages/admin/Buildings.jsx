import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { PageLoader, EmptyState, ErrorState } from '../../components/common/Loader';
import { getStatusClasses } from '../../utils/helpers';

const Buildings = () => {
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);
    const [form, setForm] = useState({ name: '', location: '', basements: '', totalSlots: '' });
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await adminService.getBuildings();
            if (res.success) setBuildings(res.data);
        } catch (err) {
            setError('Failed to load buildings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const openCreate = () => {
        setEditItem(null);
        setForm({ name: '', location: '', basements: '', totalSlots: '' });
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditItem(item);
        setForm({ name: item.name, location: item.location, basements: item.basements, totalSlots: item.totalSlots });
        setModalOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (editItem) {
                const res = await adminService.updateBuilding(editItem.id, form);
                if (res.success) setBuildings(prev => prev.map(b => b.id === editItem.id ? { ...b, ...form } : b));
            } else {
                const res = await adminService.createBuilding(form);
                if (res.success) setBuildings(prev => [...prev, res.data]);
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
            await adminService.deleteBuilding(deleteModal.id);
            setBuildings(prev => prev.filter(b => b.id !== deleteModal.id));
            setDeleteModal(null);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <PageLoader />;
    if (error) return <ErrorState message={error} onRetry={fetchData} />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Buildings</h1>
                    <p className="text-sm text-text-secondary mt-1">Manage your parking buildings and configurations</p>
                </div>
                <Button icon={Plus} onClick={openCreate} size="lg">Add Building</Button>
            </div>

            {buildings.length === 0 ? (
                <EmptyState icon={Building2} title="No buildings added" description="Start by adding your first building to manage parking." />
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-lg border border-surface-200 overflow-hidden shadow-md"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-surface-200 bg-surface-50">
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Building</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Location</th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Basements</th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Slots</th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {buildings.map((b, idx) => (
                                    <motion.tr
                                        key={b.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-surface-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
                                                    <Building2 className="w-4 h-4 text-primary-600" />
                                                </div>
                                                <span className="text-sm font-semibold text-text-primary">{b.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                                                <MapPin className="w-3.5 h-3.5 text-text-muted" />
                                                {b.location}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-surface-100 text-text-secondary">{b.basements}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">{b.totalSlots}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                                b.status === 'Active' ? 'bg-success-100 text-success-700' :
                                                b.status === 'Inactive' ? 'bg-danger-100 text-danger-700' :
                                                'bg-warning-100 text-warning-700'
                                            }`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg hover:bg-primary-50 text-text-muted hover:text-primary-600 transition-colors">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setDeleteModal(b)} className="p-1.5 rounded-lg hover:bg-danger-50 text-text-muted hover:text-danger-600 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {/* Create/Edit Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Building' : 'Add Building'} size="md">
                <div className="space-y-4">
                    <Input required label="Building Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tower A" />
                    <Input required label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="123 Main Street" />
                    <div className="grid grid-cols-2 gap-4">
                        <Input required label="Basements" type="number" value={form.basements} onChange={(e) => setForm({ ...form, basements: e.target.value })} placeholder="3" />
                        <Input required label="Total Slots" type="number" value={form.totalSlots} onChange={(e) => setForm({ ...form, totalSlots: e.target.value })} placeholder="120" />
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t border-surface-200">
                        <Button variant="outlineGray" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} loading={saving}>{editItem ? 'Update Building' : 'Create Building'}</Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Remove Building" size="xs">
                <div className="space-y-4">
                    <p className="text-sm text-text-secondary">
                        Are you sure you want to delete <strong>{deleteModal?.name}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2 pt-2 border-t border-surface-200">
                        <Button variant="outlineGray" onClick={() => setDeleteModal(null)}>Cancel</Button>
                        <Button variant="danger" onClick={handleDelete}>Delete Building</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Buildings;
