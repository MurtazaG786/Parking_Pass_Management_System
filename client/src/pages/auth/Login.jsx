import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, Car, ArrowRight } from 'lucide-react';
import { Dropdown } from 'primereact/dropdown';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('admin');
    const [error, setError] = useState('');

    const roleOptions = [
        { label: 'Admin', value: 'admin' },
        { label: 'Security Guard', value: 'security' },
        { label: 'Driver', value: 'driver' },
    ];

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            const res = await login({ ...data, role });
            if (res.success) {
                navigate(`/${role}/dashboard`);
            } else {
                setError(res.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-50 to-secondary-100 flex items-center justify-center px-4 py-8 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-primary-300/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md z-10"
            >
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: 'spring' }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 mb-4 shadow-lg"
                    >
                        <Car className="w-8 h-8 text-white" strokeWidth={1.5} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-bold text-text-primary mb-2"
                    >
                        ParkEase
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-text-secondary"
                    >
                        Parking Management System
                    </motion.p>
                </div>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-lg p-8 border border-surface-200"
                >
                    {/* Error Alert */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-5 p-4 bg-danger-50 border border-danger-200 rounded-lg"
                        >
                            <p className="text-sm font-medium text-danger-600">{error}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Email Input */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                            <Input
                                label="Email Address"
                                icon={Mail}
                                type="email"
                                placeholder="admin@parkease.com"
                                required
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
                                })}
                                error={errors.email?.message}
                            />
                        </motion.div>

                        {/* Password Input */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
                            <Input
                                label="Password"
                                icon={Lock}
                                type="password"
                                placeholder="Enter your password"
                                required
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 3, message: 'Minimum 3 characters' }
                                })}
                                error={errors.password?.message}
                            />
                        </motion.div>

                        {/* Role Selector */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">Login As</label>
                            <Dropdown
                                value={role}
                                onChange={(e) => setRole(e.value)}
                                options={roleOptions}
                                placeholder="Select your role"
                                className="w-full"
                                pt={{
                                    root: { className: 'w-full border border-surface-200 rounded-lg hover:border-primary-300 bg-white' },
                                    input: { className: 'px-3.5 py-2.5 text-sm text-text-primary' },
                                    item: { className: 'text-sm py-2' },
                                }}
                            />
                        </motion.div>

                        {/* Sign In Button */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                            <Button
                                type="submit"
                                loading={loading}
                                fullWidth
                                size="lg"
                                className="rounded-lg"
                                icon={!loading ? ArrowRight : undefined}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </motion.div>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-3">
                        <div className="flex-1 h-px bg-surface-200" />
                        <span className="text-xs text-text-muted">OR</span>
                        <div className="flex-1 h-px bg-surface-200" />
                    </div>

                    {/* Demo Credentials */}
                    <div className="bg-primary-50 rounded-lg p-4 mb-6 border border-primary-100">
                        <p className="text-xs font-semibold text-primary-900 mb-2">Demo Credentials:</p>
                        <div className="text-xs text-primary-800 space-y-1">
                            <p><span className="font-medium">Email:</span> demo@parkease.com</p>
                            <p><span className="font-medium">Password:</span> password123</p>
                        </div>
                    </div>

                    {/* Register Link */}
                    <div className="text-center">
                        <p className="text-sm text-text-secondary">
                            New user?{' '}
                            <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center gap-1">
                                Register here <ArrowRight className="w-3 h-3" />
                            </Link>
                        </p>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center text-xs text-text-muted mt-8"
                >
                    &copy; {new Date().getFullYear()} ParkEase Management System. All rights reserved.
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Login;
