import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, User, Menu, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { capitalize } from '../../utils/helpers';

const Navbar = ({ onMenuToggle }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const dropRef = useRef(null);
    const notifRef = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-30 bg-white border-b border-neutral-200 shadow-sm">
            <div className="px-4 lg:px-6 h-16 flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onMenuToggle} 
                        className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors focus:ring-2 focus:ring-primary-500"
                    >
                        <Menu className="w-5 h-5 text-neutral-600" />
                    </button>
                    <div className="hidden sm:flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-sm">P</span>
                        </div>
                        <span className="text-lg font-bold text-neutral-900">
                            Park<span className="text-primary-600">Ease</span>
                        </span>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-1">
                    {/* Notifications */}
                    <div className="relative" ref={notifRef}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setNotifOpen(!notifOpen)}
                            className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors focus:ring-2 focus:ring-primary-500"
                        >
                            <Bell className="w-5 h-5 text-neutral-600" />
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger-500 rounded-full border-2 border-white" />
                        </motion.button>
                        <AnimatePresence>
                            {notifOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-card-lg border border-neutral-200 overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="p-4 border-b border-neutral-100 bg-neutral-50">
                                        <h4 className="text-sm font-semibold text-neutral-900">Notifications</h4>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto divide-y divide-neutral-100">
                                        {[
                                            { text: 'New vehicle entry at Tower A', time: '2 min ago', icon: '🚗' },
                                            { text: 'Slot A3 is now available', time: '5 min ago', icon: '✓' },
                                            { text: 'Payment received — ₹120', time: '15 min ago', icon: '💳' },
                                        ].map((n, i) => (
                                            <div key={i} className="px-4 py-3 hover:bg-neutral-50 cursor-pointer transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <span className="text-lg">{n.icon}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-neutral-700">{n.text}</p>
                                                        <p className="text-xs text-neutral-500 mt-0.5">{n.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropRef}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors focus:ring-2 focus:ring-primary-500"
                        >
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                                <span className="text-primary-700 text-sm font-semibold">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium text-neutral-900 leading-tight">{user?.name || 'User'}</p>
                                <p className="text-xs text-neutral-500">{capitalize(user?.role || '')}</p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-neutral-400 hidden sm:block" />
                        </motion.button>
                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-card-lg border border-neutral-200 overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50">
                                        <p className="text-sm font-semibold text-neutral-900">{user?.name}</p>
                                        <p className="text-xs text-neutral-500 mt-0.5">{user?.email}</p>
                                    </div>
                                    <div className="py-1">
                                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                                            <User className="w-4 h-4" />
                                            Profile Settings
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </button>
                                    </div>
                                    <div className="border-t border-neutral-100 p-1">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
