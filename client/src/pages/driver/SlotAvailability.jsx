// driver/SlotAvailability.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ParkingSquare, 
  Building2, 
  ChevronDown,
  Car,
  Bike,
  Filter,
  Search
} from 'lucide-react';
import { driverService } from '../../services/driverService';
import { PageLoader, EmptyState } from '../../components/common/Loader';
import { SLOT_COLORS } from '../../utils/constants';

const SlotAvailability = () => {
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedBasements, setExpandedBasements] = useState(new Set());
    const [selectedBuilding, setSelectedBuilding] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await driverService.getAvailableSlots();
                if (res.success) setBuildings(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const toggleBasement = (basementId) => {
        const newExpanded = new Set(expandedBasements);
        if (newExpanded.has(basementId)) {
            newExpanded.delete(basementId);
        } else {
            newExpanded.add(basementId);
        }
        setExpandedBasements(newExpanded);
    };

    const expandAll = () => {
        const allIds = new Set();
        buildings.forEach(building => 
            building.basements.forEach(basement => 
                allIds.add(basement.id)
            )
        );
        setExpandedBasements(allIds);
    };

    const collapseAll = () => {
        setExpandedBasements(new Set());
    };

    const getAvailableCount = (basement) => {
        return basement.slots.filter(s => s.status === 'available').length;
    };

    const getTotalCount = (basement) => {
        return basement.slots.length;
    };

    const filteredBuildings = buildings.filter(building => 
        selectedBuilding === 'all' || building.id === selectedBuilding
    );

    if (loading) return <PageLoader />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        Parking Slot Availability
                    </h1>
                    <p className="text-gray-500 mt-1">Real-time availability across all buildings</p>
                </div>

                {/* Filters */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-5 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search slots..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            />
                        </div>
                        
                        <select
                            value={selectedBuilding}
                            onChange={(e) => setSelectedBuilding(e.target.value)}
                            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        >
                            <option value="all">All Buildings</option>
                            {buildings.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>

                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        >
                            <option value="all">All Vehicles</option>
                            <option value="2w">Two Wheeler</option>
                            <option value="4w">Four Wheeler</option>
                        </select>

                        <div className="flex gap-2">
                            <button
                                onClick={expandAll}
                                className="flex-1 px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors"
                            >
                                Expand All
                            </button>
                            <button
                                onClick={collapseAll}
                                className="flex-1 px-4 py-2.5 bg-gray-50 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
                            >
                                Collapse
                            </button>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-6 mb-6 bg-white/50 backdrop-blur-sm rounded-xl p-4">
                    <span className="text-sm font-medium text-gray-700">Status Legend:</span>
                    {['available', 'occupied', 'reserved', 'maintenance'].map(status => (
                        <div key={status} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${SLOT_COLORS[status]?.dot || 'bg-gray-300'}`} />
                            <span className="text-xs text-gray-600 capitalize">{status}</span>
                        </div>
                    ))}
                </div>

                {filteredBuildings.length === 0 ? (
                    <EmptyState 
                        icon={Building2} 
                        title="No buildings available" 
                        description="Parking buildings are not configured yet." 
                    />
                ) : (
                    <div className="space-y-6">
                        {filteredBuildings.map((building, bIdx) => (
                            <motion.div
                                key={building.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: bIdx * 0.1 }}
                                className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden"
                            >
                                {/* Building Header */}
                                <div className="px-6 py-5 bg-gradient-to-r from-primary-600 to-primary-700">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                                <Building2 className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{building.name}</h3>
                                                <p className="text-primary-100 text-sm mt-1">
                                                    {building.basements.reduce((acc, b) => acc + getAvailableCount(b), 0)} 
                                                    {' '}available slots • {building.basements.length} basements
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 bg-white/20 rounded-full text-xs text-white">
                                                {building.type || 'Mixed'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Basements */}
                                <div className="p-6 space-y-4">
                                    {building.basements.map((basement) => {
                                        const available = getAvailableCount(basement);
                                        const total = getTotalCount(basement);
                                        const isExpanded = expandedBasements.has(basement.id);
                                        const availabilityPercentage = (available / total) * 100;

                                        return (
                                            <div key={basement.id} className="border border-gray-200 rounded-xl overflow-hidden">
                                                <button
                                                    onClick={() => toggleBasement(basement.id)}
                                                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <ParkingSquare className="w-5 h-5 text-primary-600" />
                                                            <span className="font-semibold text-gray-900">{basement.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                <div 
                                                                    className="h-full bg-gradient-to-r from-success-500 to-success-600 rounded-full"
                                                                    style={{ width: `${availabilityPercentage}%` }}
                                                                />
                                                            </div>
                                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                                available > 0 
                                                                    ? 'bg-green-100 text-green-700' 
                                                                    : 'bg-red-100 text-red-700'
                                                            }`}>
                                                                {available}/{total} available
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                </button>

                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="border-t border-gray-100"
                                                        >
                                                            <div className="p-5 bg-gray-50/50">
                                                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                                                                    {basement.slots
                                                                        .filter(slot => 
                                                                            searchTerm === '' || 
                                                                            slot.slotNumber.toLowerCase().includes(searchTerm.toLowerCase())
                                                                        )
                                                                        .filter(slot => 
                                                                            filterType === 'all' || 
                                                                            slot.type === filterType
                                                                        )
                                                                        .map((slot, idx) => {
                                                                            const colors = SLOT_COLORS[slot.status] || SLOT_COLORS.disabled;
                                                                            return (
                                                                                <motion.div
                                                                                    key={slot.id}
                                                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                                    transition={{ delay: idx * 0.02 }}
                                                                                    className={`relative group cursor-pointer`}
                                                                                >
                                                                                    <div className={`
                                                                                        aspect-square rounded-xl border-2 ${colors.border}
                                                                                        ${colors.bg} ${colors.hover}
                                                                                        flex flex-col items-center justify-center
                                                                                        transition-all duration-200
                                                                                        hover:shadow-lg hover:-translate-y-0.5
                                                                                    `}>
                                                                                        <span className={`text-xs font-bold ${colors.text}`}>
                                                                                            {slot.slotNumber}
                                                                                        </span>
                                                                                        {slot.type === '2w' ? (
                                                                                            <Bike className={`w-3 h-3 mt-1 ${colors.text}`} />
                                                                                        ) : (
                                                                                            <Car className={`w-3 h-3 mt-1 ${colors.text}`} />
                                                                                        )}
                                                                                    </div>
                                                                                    
                                                                                    {/* Tooltip */}
                                                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                                                        {slot.slotNumber} - {slot.status}
                                                                                    </div>
                                                                                </motion.div>
                                                                            );
                                                                        })}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SlotAvailability;