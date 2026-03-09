import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Car, ChevronLeft } from 'lucide-react';
import { Dropdown } from 'primereact/dropdown';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { VEHICLE_TYPES } from '../../utils/constants';

const Register = () => {
    const { register: formRegister, handleSubmit, formState: { errors } } = useForm();
    const { register: authRegister } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [vehicleType, setVehicleType] = useState('4W');
    const [error, setError] = useState('');

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            const res = await authRegister({ ...data, vehicleType, role: 'driver' });
            if (res.success) {
                navigate('/driver/dashboard');
            } else {
                setError(res.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-50 to-secondary-100 flex items-center justify-center px-4 py-8 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-primary-300/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-lg z-10"
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
                        Join ParkEase
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-text-secondary"
                    >
                        Create an account to start parking with us
                    </motion.p>
                </div>

                {/* Registration Card */}
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
                            <p className="text-sm font-medium text-danger-700">{error}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Full Name */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                            <Input
                                label="Full Name"
                                icon={User}
                                placeholder="John Doe"
                                required
                                {...formRegister('name', { required: 'Name is required' })}
                                error={errors.name?.message}
                            />
                        </motion.div>

                        {/* Email */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                            <Input
                                label="Email Address"
                                icon={Mail}
                                type="email"
                                placeholder="your@email.com"
                                required
                                {...formRegister('email', {
                                    required: 'Email is required',
                                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
                                })}
                                error={errors.email?.message}
                            />
                        </motion.div>

                        {/* Phone */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
                            <Input
                                label="Phone Number"
                                icon={Phone}
                                placeholder="9876543210"
                                required
                                {...formRegister('phone', {
                                    required: 'Phone is required',
                                    pattern: { value: /^[0-9]{10}$/, message: 'Enter valid 10-digit number' }
                                })}
                                error={errors.phone?.message}
                            />
                        </motion.div>

                        {/* Vehicle Number */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                            <Input
                                label="Vehicle Number"
                                icon={Car}
                                placeholder="MH-12-AB-1234"
                                required
                                {...formRegister('vehicleNumber', { required: 'Vehicle number is required' })}
                                error={errors.vehicleNumber?.message}
                            />
                        </motion.div>

                        {/* Vehicle Type */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">Vehicle Type</label>
                            <Dropdown
                                value={vehicleType}
                                onChange={(e) => setVehicleType(e.value)}
                                options={VEHICLE_TYPES}
                                placeholder="Select Vehicle Type"
                                className="w-full"
                                pt={{
                                    root: { className: 'w-full border border-neutral-300 rounded-lg hover:border-neutral-400 bg-white' },
                                    input: { className: 'px-3.5 py-2.5 text-sm text-neutral-900' },
                                    item: { className: 'text-sm py-2' },
                                }}
                            />
                        </motion.div>

                        {/* Password */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                            <Input
                                label="Password"
                                icon={Lock}
                                type="password"
                                placeholder="Minimum 6 characters"
                                required
                                {...formRegister('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Minimum 6 characters required' }
                                })}
                                error={errors.password?.message}
                            />
                        </motion.div>

                        {/* Register Button */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="pt-2">
                            <Button
                                type="submit"
                                loading={loading}
                                fullWidth
                                size="lg"
                                className="rounded-lg"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </motion.div>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-3">
                        <div className="flex-1 h-px bg-neutral-200" />
                        <span className="text-xs text-neutral-500">OR</span>
                        <div className="flex-1 h-px bg-neutral-200" />
                    </div>

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-sm text-neutral-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center gap-1">
                                <ChevronLeft className="w-3 h-3" /> Back to Login
                            </Link>
                        </p>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center text-xs text-neutral-500 mt-8"
                >
                    &copy; {new Date().getFullYear()} ParkEase Management System. All rights reserved.
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Register;
