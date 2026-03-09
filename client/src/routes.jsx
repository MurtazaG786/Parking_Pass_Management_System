import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import Buildings from './pages/admin/Buildings';
import Basements from './pages/admin/Basements';
import ParkingSlots from './pages/admin/ParkingSlots';
import Pricing from './pages/admin/Pricing';
import Subscriptions from './pages/admin/Subscriptions';
import SecurityManagement from './pages/admin/SecurityManagement';
import Reports from './pages/admin/Reports';

// Security pages
import Entry from './pages/security/Entry';
import Exit from './pages/security/Exit';
import SlotAllocation from './pages/security/SlotAllocation';
import Ticket from './pages/security/Ticket';
import PaymentVerification from './pages/security/PaymentVerification';
import SecurityDashboard from './pages/security/Dashboard';

// Driver pages
import DriverDashboard from './pages/driver/Dashboard';
import SlotAvailability from './pages/driver/SlotAvailability';
import TicketView from './pages/driver/TicketView';
import Payment from './pages/driver/Payment';
import Subscription from './pages/driver/Subscription';

// Protected route wrapper
const ProtectedRoute = ({ children, roles }) => {
    const { user, isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(user?.role)) return <Navigate to={`/${user?.role}/dashboard`} replace />;
    return children;
};

export const routes = [
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },

    // Admin routes
    { path: '/admin/dashboard', element: <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute> },
    { path: '/admin/buildings', element: <ProtectedRoute roles={['admin']}><Buildings /></ProtectedRoute> },
    { path: '/admin/basements', element: <ProtectedRoute roles={['admin']}><Basements /></ProtectedRoute> },
    { path: '/admin/slots', element: <ProtectedRoute roles={['admin']}><ParkingSlots /></ProtectedRoute> },
    { path: '/admin/pricing', element: <ProtectedRoute roles={['admin']}><Pricing /></ProtectedRoute> },
    { path: '/admin/subscriptions', element: <ProtectedRoute roles={['admin']}><Subscriptions /></ProtectedRoute> },
    { path: '/admin/security-management', element: <ProtectedRoute roles={['admin']}><SecurityManagement /></ProtectedRoute> },
    { path: '/admin/reports', element: <ProtectedRoute roles={['admin']}><Reports /></ProtectedRoute> },

    // Security routes
    { path: '/security/dashboard', element: <ProtectedRoute roles={['security']}><SecurityDashboard /></ProtectedRoute> },
    { path: '/security/entry', element: <ProtectedRoute roles={['security']}><Entry /></ProtectedRoute> },
    { path: '/security/exit', element: <ProtectedRoute roles={['security']}><Exit /></ProtectedRoute> },
    { path: '/security/slot-allocation', element: <ProtectedRoute roles={['security']}><SlotAllocation /></ProtectedRoute> },
    { path: '/security/tickets', element: <ProtectedRoute roles={['security']}><Ticket /></ProtectedRoute> },
    { path: '/security/payments', element: <ProtectedRoute roles={['security']}><PaymentVerification /></ProtectedRoute> },

    // Driver routes
    { path: '/driver/dashboard', element: <ProtectedRoute roles={['driver']}><DriverDashboard /></ProtectedRoute> },
    { path: '/driver/slots', element: <ProtectedRoute roles={['driver']}><SlotAvailability /></ProtectedRoute> },
    { path: '/driver/tickets', element: <ProtectedRoute roles={['driver']}><TicketView /></ProtectedRoute> },
    { path: '/driver/payments', element: <ProtectedRoute roles={['driver']}><Payment /></ProtectedRoute> },
    { path: '/driver/subscriptions', element: <ProtectedRoute roles={['driver']}><Subscription /></ProtectedRoute> },

    // Default redirect
    { path: '/', element: <Navigate to="/login" replace /> },
    { path: '*', element: <Navigate to="/login" replace /> },
];
