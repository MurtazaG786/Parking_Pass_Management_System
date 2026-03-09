// driver/Payment.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  Clock, 
  Car, 
  IndianRupee, 
  CheckCircle2, 
  CreditCard,
  Smartphone,
  Landmark,
  Receipt,
  AlertCircle
} from 'lucide-react';
import { driverService } from '../../services/driverService';
import Button from '../../components/common/Button';
import { PageLoader, ErrorState } from '../../components/common/Loader';
import { formatDateTime, formatCurrency } from '../../utils/helpers';

const Payment = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [processing, setProcessing] = useState(false);
    const [paid, setPaid] = useState(false);

    const paymentMethods = [
        { id: 'upi', label: 'UPI', icon: Smartphone, color: 'from-primary-500 to-primary-600' },
        { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, color: 'from-secondary-500 to-secondary-600' },
        { id: 'netbanking', label: 'Net Banking', icon: Landmark, color: 'from-success-500 to-success-600' },
        { id: 'cash', label: 'Cash', icon: Wallet, color: 'from-warning-500 to-warning-600' },
    ];

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await driverService.getPaymentDetails();
                if (res.success) setData(res.data);
            } catch (err) {
                setError('Failed to load payment details');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const handlePay = async () => {
        setProcessing(true);
        try {
            const res = await driverService.makePayment({ 
                amount: data.grandTotal, 
                method: paymentMethod 
            });
            if (res.success) setPaid(true);
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <PageLoader />;
    if (error) return <ErrorState message={error} />;

    if (paid) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full"
                >
                    <div className="bg-white rounded-lg border border-neutral-200 shadow-card-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-success-500 to-success-600 px-8 py-12 text-center relative">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-card"
                            >
                                <CheckCircle2 className="w-10 h-10 text-success-500" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                            <p className="text-success-100 text-sm">Your parking payment has been confirmed</p>
                        </div>
                        
                        <div className="p-8">
                            <div className="text-center mb-6">
                                <p className="text-sm text-neutral-600 mb-1">Amount Paid</p>
                                <p className="text-4xl font-bold text-neutral-900">{formatCurrency(data?.grandTotal)}</p>
                                <p className="text-sm text-neutral-600 mt-2">via {paymentMethods.find(m => m.id === paymentMethod)?.label}</p>
                            </div>
                            
                            <div className="bg-neutral-50 rounded-lg p-4 mb-6 border border-neutral-200">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-neutral-600">Transaction ID</span>
                                    <span className="font-mono font-medium">TXN{Math.random().toString(36).substring(7).toUpperCase()}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm mt-3">
                                    <span className="text-neutral-600">Date & Time</span>
                                    <span className="font-medium">{new Date().toLocaleString()}</span>
                                </div>
                            </div>
                            
                            <Button 
                                onClick={() => window.location.href = '/driver/dashboard'}
                                size="lg"
                                className="w-full"
                            >
                                Back to Dashboard
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900">Complete Payment</h1>
                    <p className="text-neutral-600 mt-1">Review your parking bill and complete the payment</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Payment Details */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg border border-neutral-200 shadow-card overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
                                <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                                        <Receipt className="w-4 h-4 text-primary-600" />
                                    </div>
                                    Payment Summary
                                </h2>
                            </div>

                            <div className="p-6">
                                {/* Vehicle Info */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {[
                                        { label: 'Vehicle Number', value: data?.vehicleNumber },
                                        { label: 'Vehicle Type', value: data?.vehicleType },
                                        { label: 'Building', value: data?.building },
                                        { label: 'Slot Number', value: data?.slotNumber },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                                            <p className="text-xs text-neutral-600 mb-1 font-medium">{item.label}</p>
                                            <p className="text-sm font-semibold text-neutral-900">{item.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Time Info */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                                        <p className="text-xs text-primary-600 mb-1 font-medium">Entry Time</p>
                                        <p className="text-sm font-semibold text-primary-900">{formatDateTime(data?.entryTime)}</p>
                                    </div>
                                    <div className="bg-warning-50 rounded-lg p-4 border border-warning-200">
                                        <p className="text-xs text-warning-600 mb-1 font-medium">Duration</p>
                                        <p className="text-sm font-semibold text-warning-900">{data?.duration}</p>
                                    </div>
                                </div>

                                {/* Bill Breakdown */}
                                <div className="bg-neutral-50 rounded-lg p-5 mb-6 border border-neutral-200">
                                    <h3 className="text-sm font-semibold text-neutral-900 mb-3">Bill Breakdown</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-neutral-600">
                                                Parking Rate ({data?.ratePerHour}/hr × {data?.duration})
                                            </span>
                                            <span className="font-medium text-neutral-900">{formatCurrency(data?.totalAmount)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-neutral-600">GST (18%)</span>
                                            <span className="font-medium text-neutral-900">{formatCurrency(data?.tax)}</span>
                                        </div>
                                        <div className="border-t border-neutral-200 my-2 pt-2">
                                            <div className="flex justify-between">
                                                <span className="font-semibold text-neutral-900">Grand Total</span>
                                                <span className="text-xl font-bold text-primary-600">{formatCurrency(data?.grandTotal)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Methods */}
                                <div>
                                    <h3 className="text-sm font-semibold text-neutral-900 mb-3">Select Payment Method</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {paymentMethods.map((method) => (
                                            <motion.button
                                                key={method.id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`p-4 rounded-lg border-2 transition-all ${
                                                    paymentMethod === method.id
                                                        ? 'border-primary-500 bg-primary-50'
                                                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                                                }`}
                                            >
                                                <div className="flex flex-col items-center text-center">
                                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center mb-2`}>
                                                        <method.icon className="w-5 h-5 text-white" />
                                                    </div>
                                                    <span className={`text-xs font-medium ${
                                                        paymentMethod === method.id ? 'text-neutral-900' : 'text-neutral-600'
                                                    }`}>
                                                        {method.label}
                                                    </span>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Payment Summary Card */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-lg border border-neutral-200 shadow-card overflow-hidden sticky top-6"
                        >
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Order Summary</h3>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-600">Subtotal</span>
                                        <span className="font-medium text-neutral-900">{formatCurrency(data?.totalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-600">GST (18%)</span>
                                        <span className="font-medium text-neutral-900">{formatCurrency(data?.tax)}</span>
                                    </div>
                                    <div className="border-t border-neutral-200 pt-3">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-neutral-900">Total</span>
                                            <span className="text-2xl font-bold text-primary-600">{formatCurrency(data?.grandTotal)}</span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handlePay}
                                    loading={processing}
                                    size="lg"
                                    className="w-full"
                                >
                                    Pay {formatCurrency(data?.grandTotal)}
                                </Button>

                                <p className="text-xs text-neutral-500 text-center mt-4 flex items-center justify-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    Secure payment powered by industry-standard encryption
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;