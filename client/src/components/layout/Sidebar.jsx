import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_LINKS, SECURITY_LINKS, DRIVER_LINKS } from '../../utils/constants';
import * as LucideIcons from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const location = useLocation();

    const links = user?.role === 'admin' ? ADMIN_LINKS
        : user?.role === 'security' ? SECURITY_LINKS
            : DRIVER_LINKS;

    const roleLabel = user?.role === 'admin' ? 'Admin Panel'
        : user?.role === 'security' ? 'Security Panel'
            : 'Driver Portal';

    return (
        <>
            {/* Mobile overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-64 bg-surface-50 border-r border-surface-200 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-5 border-b border-surface-200">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-base">P</span>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-text-primary leading-none">ParkEase</h2>
                            <p className="text-[11px] text-text-secondary mt-0.5">{roleLabel}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-surface-200 transition-colors">
                        <X className="w-5 h-5 text-text-primary" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    <div className="space-y-1">
                        {links.map((link) => {
                            const IconComp = LucideIcons[link.icon];
                            const isActive = location.pathname === link.path;
                            return (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    onClick={onClose}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${isActive
                                            ? 'bg-primary-100 text-primary-700'
                                            : 'text-text-secondary hover:bg-surface-100 hover:text-text-primary'
                                        }`}
                                >
                                    {IconComp && (
                                        <IconComp className={`w-[18px] h-[18px] transition-colors flex-shrink-0 ${isActive ? 'text-primary-600' : 'text-text-secondary group-hover:text-text-primary'
                                            }`} />
                                    )}
                                    <span className="flex-1">{link.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active"
                                            className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-l-full"
                                        />
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-surface-200 bg-surface-100">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-primary-600 text-xs font-bold">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text-primary truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-text-secondary truncate">{user?.email || ''}</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
