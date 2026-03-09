// driver/Subscription.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Check, 
  Star, 
  Zap,
  Shield,
  Clock,
  Calendar,
  Gift,
  TrendingUp
} from 'lucide-react';
import { driverService } from '../../services/driverService';
import Button from '../../components/common/Button';
import { PageLoader, ErrorState, EmptyState } from '../../components/common/Loader';
import { formatCurrency } from '../../utils/helpers';

const Subscription = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subscribing, setSubscribing] = useState(null);
    const [subscribed, setSubscribed] = useState(null);
    const [billingCycle, setBillingCycle] = useState('monthly');

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await driverService.getSubscriptionPlans();
                if (res.success) setPlans(res.data);
            } catch (err) {
                setError('Failed to load plans');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const handleSubscribe = async (planId) => {
        setSubscribing(planId);
        try {
            const res = await driverService.subscribe(planId);
            if (res.success) setSubscribed(planId);
        } catch (err) {
            console.error(err);
        } finally {
            setSubscribing(null);
        }
    };

    if (loading) return <PageLoader />;
    if (error) return <ErrorState message={error} />;

    const features = [
        'Priority parking allocation',
        'Discounted hourly rates',
        'Free cancellation',
        '24/7 customer support',
        'Access to all buildings',
        'Digital parking pass'
    ];

    return (
        <div className="min-h-screen bg-neutral-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg mb-4"
                    >
                        <Gift className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-neutral-900">
                        Subscription Plans
                    </h1>
                    <p className="text-neutral-600 mt-2 max-w-2xl mx-auto">
                        Choose the perfect plan for your parking needs. Save more with longer commitments.
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center mb-10">
                    <div className="bg-white border border-neutral-200 p-1 rounded-lg inline-flex shadow-card">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                                billingCycle === 'monthly'
                                    ? 'bg-primary-600 text-white'
                                    : 'text-neutral-600 hover:text-neutral-900'
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                                billingCycle === 'yearly'
                                    ? 'bg-primary-600 text-white'
                                    : 'text-neutral-600 hover:text-neutral-900'
                            }`}
                        >
                            Yearly
                            <span className="ml-2 text-xs bg-success-100 text-success-600 px-2 py-0.5 rounded-full">
                                Save 20%
                            </span>
                        </button>
                    </div>
                </div>

                {plans.length === 0 ? (
                    <EmptyState 
                        icon={CreditCard} 
                        title="No plans available" 
                        description="Subscription plans are not available yet." 
                    />
                ) : (
                    <>
                        {/* Feature Highlights */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-lg p-3 text-center border border-neutral-200 shadow-card"
                                >
                                    <Check className="w-4 h-4 text-success-500 mx-auto mb-2" />
                                    <span className="text-xs text-neutral-600">{feature}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Plans Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {plans.map((plan, idx) => {
                                const isPopular = idx === 1; // Example logic
                                const isYearly = billingCycle === 'yearly';
                                const price = isYearly ? plan.price * 10 : plan.price; // 20% discount on yearly
                                
                                return (
                                    <motion.div
                                        key={plan.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        whileHover={{ y: -8 }}
                                        className={`relative group ${
                                            isPopular ? 'lg:-mt-4 lg:mb-4' : ''
                                        }`}
                                    >
                                        {isPopular && (
                                            <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                                                <div className="bg-gradient-to-r from-warning-500 to-warning-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                                                    <Star className="w-3 h-3" />
                                                    MOST POPULAR
                                                </div>
                                            </div>
                                        )}

                                        <div className={`h-full bg-white rounded-lg border-2 overflow-hidden transition-all ${
                                            isPopular 
                                                ? 'border-accent-300 shadow-card-lg' 
                                                : 'border-neutral-200 shadow-card hover:shadow-card-hover'
                                        }`}>
                                            {/* Plan Header */}
                                            <div className={`px-6 py-5 ${
                                                isPopular 
                                                    ? 'bg-gradient-to-r from-accent-500 to-accent-600' 
                                                    : 'bg-gradient-to-r from-primary-500 to-primary-600'
                                            }`}>
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                        <Zap className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                                                        <p className="text-xs text-white/80">{plan.vehicleType}</p>
                                                    </div>
                                                </div>
                                                <div className="text-white">
                                                    <span className="text-3xl font-bold">{formatCurrency(price)}</span>
                                                    <span className="text-sm text-white/80">/{isYearly ? 'year' : 'month'}</span>
                                                </div>
                                                {isYearly && (
                                                    <p className="text-xs text-white/80 mt-1 line-through">
                                                        {formatCurrency(plan.price * 12)}/year
                                                    </p>
                                                )}
                                            </div>

                                            {/* Plan Features */}
                                            <div className="p-6">
                                                <ul className="space-y-3 mb-6">
                                                    {plan.features.map((feature, i) => (
                                                        <motion.li
                                                            key={i}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            className="flex items-start gap-2"
                                                        >
                                                            <div className="w-5 h-5 rounded-full bg-success-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                <Check className="w-3 h-3 text-success-600" />
                                                            </div>
                                                            <span className="text-sm text-neutral-600">{feature}</span>
                                                        </motion.li>
                                                    ))}
                                                </ul>

                                                {/* Action Button */}
                                                {subscribed === plan.id ? (
                                                    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-success-50 text-success-600 rounded-lg text-sm font-medium border border-success-200">
                                                        <Check className="w-4 h-4" />
                                                        Currently Active
                                                    </div>
                                                ) : (
                                                    <Button
                                                        onClick={() => handleSubscribe(plan.id)}
                                                        loading={subscribing === plan.id}
                                                        size="lg"
                                                        className={`w-full ${
                                                            isPopular
                                                                ? 'bg-gradient-to-r from-warning-500 to-warning-600'
                                                                : 'bg-gradient-to-r from-primary-500 to-primary-600'
                                                        }`}
                                                    >
                                                        Subscribe Now
                                                    </Button>
                                                )}

                                                {/* Plan Stats */}
                                                <div className="mt-4 pt-4 border-t border-neutral-200 grid grid-cols-2 gap-2">
                                                    <div className="text-center">
                                                        <Calendar className="w-4 h-4 text-neutral-400 mx-auto mb-1" />
                                                        <p className="text-xs text-neutral-600">Duration</p>
                                                        <p className="text-xs font-semibold text-neutral-900">{plan.duration}</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <TrendingUp className="w-4 h-4 text-neutral-400 mx-auto mb-1" />
                                                        <p className="text-xs text-neutral-600">Savings</p>
                                                        <p className="text-xs font-semibold text-success-600">Up to 30%</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-success-500" />
                                <span className="text-xs text-neutral-600">Secure Payments</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary-500" />
                                <span className="text-xs text-neutral-600">Cancel Anytime</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-secondary-500" />
                                <span className="text-xs text-neutral-600">Multiple Payment Options</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Subscription;