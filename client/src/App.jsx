import { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import { routes } from './routes';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import { PageLoader } from './components/common/Loader';

// PrimeReact styles
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const pageVariants = {
    initial: { opacity: 0, y: 12 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -12 },
};

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-surface-bg">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
                <main className="flex-1 overflow-y-auto">
                    <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="in"
                        exit="out"
                        transition={{ duration: 0.25 }}
                        className="p-4 lg:p-6 min-h-full"
                    >
                        {children}
                    </motion.div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

const App = () => {
    const { loading, isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (loading) return <PageLoader />;

    const isAuthPage = ['/login', '/register'].includes(location.pathname);

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {routes.map((route) => {
                    const isAuth = ['/login', '/register'].includes(route.path);
                    return (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={
                                isAuth ? (
                                    isAuthenticated ? <Navigate to={`/${user?.role}/dashboard`} replace /> : route.element
                                ) : (
                                    <DashboardLayout>{route.element}</DashboardLayout>
                                )
                            }
                        />
                    );
                })}
            </Routes>
        </AnimatePresence>
    );
};

export default App;
