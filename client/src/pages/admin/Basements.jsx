import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import { Dropdown } from 'primereact/dropdown';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { PageLoader, EmptyState, ErrorState } from '../../components/common/Loader';
import { getStatusClasses } from '../../utils/helpers';

const Basements = () => {
    const [basements, setBasements] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);
    const [form, setForm] = useState({ buildingId: '', name: '', floor: '', totalSlots: '' });
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [basementRes, buildingRes] = await Promise.all([
                adminService.getBasements(),
                adminService.getBuildings(),
            ]);
            if (basementRes.success) setBasements(basementRes.data);
            if (buildingRes.success) setBuildings(buildingRes.data);
        } catch (err) {
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const buildingOptions = buildings.map(b => ({ label: b.name, value: b.id }));

    const openCreate = () => {
        setEditItem(null);
        setForm({ buildingId: '', name: '', floor: '', totalSlots: '' });
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditItem(item);
        setForm({ buildingId: item.buildingId, name: item.name, floor: item.floor, totalSlots: item.totalSlots });
        setModalOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const buildingName = buildings.find(b => b.id === form.buildingId)?.name || '';
            if (editItem) {
                await adminService.updateBasement(editItem.id, { ...form, buildingName });
                setBasements(prev => prev.map(b => b.id === editItem.id ? { ...b, ...form, buildingName } : b));
            } else {
                const res = await adminService.createBasement({ ...form, buildingName });
                if (res.success) setBasements(prev => [...prev, res.data]);
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
            await adminService.deleteBasement(deleteModal.id);
            setBasements(prev => prev.filter(b => b.id !== deleteModal.id));
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
                    <h1 className="text-3xl font-bold text-text-primary">Basements</h1>
                    <p className="text-sm text-text-secondary mt-1">Configure basement levels and parking slots</p>
                </div>
                <Button icon={Plus} onClick={openCreate} size="lg">Add Basement</Button>
            </div>

            {basements.length === 0 ? (
                <EmptyState icon={Layers} title="No basements added" description="Add basement levels to configure parking capacity." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {basements.map((b, idx) => (
                        <motion.div
                            key={b.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ y: -2 }}
                            className="bg-white rounded-lg border border-surface-200 p-5 shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                                        <Layers className="w-5 h-5 text-violet-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-text-primary">{b.name}</h3>
                                        <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                                            <Building2 className="w-3 h-3" /> {b.buildingName}
                                        </p>
                                    </div>
                                </div>
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                    b.status === 'Active' ? 'bg-success-100 text-success-700' :
                                    b.status === 'Inactive' ? 'bg-danger-100 text-danger-700' :
                                    'bg-warning-100 text-warning-700'
                                }`}>
                                    {b.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-surface-50 rounded-lg px-3 py-2.5 border border-surface-100">
                                    <p className="text-xs text-text-muted font-medium">Floor</p>
                                    <p className="text-sm font-semibold text-text-primary mt-1">{b.floor}</p>
                                </div>
                                <div className="bg-surface-50 rounded-lg px-3 py-2.5 border border-surface-100">
                                    <p className="text-xs text-text-muted font-medium">Total Slots</p>
                                    <p className="text-sm font-semibold text-text-primary mt-1">{b.totalSlots}</p>
                                </div>
                            </div>

                            {/* Occupancy bar */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between text-xs text-neutral-600 mb-2">
                                    <span className="font-medium">Occupancy</span>
                                    <span className="font-semibold">{b.occupiedSlots}/{b.totalSlots}</span>
                                </div>
                                <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(b.occupiedSlots / b.totalSlots) * 100}%` }}
                                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                                        className={`h-full rounded-full ${(b.occupiedSlots / b.totalSlots) > 0.8 ? 'bg-danger-500' : (b.occupiedSlots / b.totalSlots) > 0.5 ? 'bg-warning-500' : 'bg-success-500'
                                            }`}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-1 pt-3 border-t border-surface-100">
                                <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg hover:bg-primary-50 text-neutral-400 hover:text-primary-600 transition-colors">
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => setDeleteModal(b)} className="p-1.5 rounded-lg hover:bg-danger-50 text-neutral-400 hover:text-danger-600 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Basement' : 'Add Basement'} size="md">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Building</label>
                        <Dropdown
                            value={form.buildingId}
                            onChange={(e) => setForm({ ...form, buildingId: e.value })}
                            options={buildingOptions}
                            placeholder="Select Building"
                            className="w-full"
                            pt={{
                                root: { className: 'w-full border border-surface-200 rounded-lg bg-white' },
                                input: { className: 'px-3.5 py-2.5 text-sm text-text-primary' },
                            }}
                        />
                    </div>
                    <Input required label="Basement Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="B1" />
                    <div className="grid grid-cols-2 gap-4">
                        <Input required label="Floor Level" type="number" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} placeholder="-1" />
                        <Input required label="Total Slots" type="number" value={form.totalSlots} onChange={(e) => setForm({ ...form, totalSlots: e.target.value })} placeholder="40" />
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t border-surface-200">
                        <Button variant="outlineGray" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} loading={saving}>{editItem ? 'Update Basement' : 'Create Basement'}</Button>
                    </div>
                </div>
            </Modal>

            {/* Delete confirmation */}
            <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Remove Basement" size="xs">
                <div className="space-y-4">
                    <p className="text-sm text-neutral-600">
                        Delete <strong>{deleteModal?.name}</strong> from <strong>{deleteModal?.buildingName}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
                        <Button variant="outlineGray" onClick={() => setDeleteModal(null)}>Cancel</Button>
                        <Button variant="danger" onClick={handleDelete}>Delete Basement</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Basements;
