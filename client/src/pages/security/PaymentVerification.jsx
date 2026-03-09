import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, CheckCircle2, Clock, Search } from 'lucide-react';
import { securityService } from '../../services/securityService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { PageLoader, EmptyState } from '../../components/common/Loader';
import { formatDateTime, formatCurrency } from '../../utils/helpers';

const PaymentVerification = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [verifying, setVerifying] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await securityService.getPendingPayments();
                if (res.success) setPayments(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const handleVerify = async (ticketId) => {
        setVerifying(ticketId);
        try {
            const res = await securityService.verifyPayment(ticketId);
            if (res.success) {
                setPayments(prev => prev.map(p => p.ticketId === ticketId ? { ...p, status: 'paid' } : p));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setVerifying(null);
        }
    };

    const filtered = payments.filter(p =>
        p.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ticketId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <PageLoader />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-neutral-900">Payment Verification</h1>
                <p className="text-sm text-neutral-600 mt-1">Verify and confirm parking payments from drivers</p>
            </div>

            <div className="max-w-md">
                <Input
                    icon={Search}
                    placeholder="Search by ticket or vehicle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filtered.length === 0 ? (
                <EmptyState icon={Wallet} title="No pending payments" description="All payments have been verified and confirmed." />
            ) : (
                <div className="space-y-3">
                    {filtered.map((p, idx) => (
                        <motion.div
                            key={p.ticketId}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-lg border border-neutral-200 p-5 shadow-card hover:shadow-card-hover transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                            <div className="flex items-start sm:items-center gap-4 flex-1">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${p.status === 'paid' ? 'bg-success-50' : 'bg-warning-50'
                                    }`}>
                                    {p.status === 'paid' ? (
                                        <CheckCircle2 className="w-5 h-5 text-success-600" />
                                    ) : (
                                        <Clock className="w-5 h-5 text-warning-600" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-neutral-900">{p.vehicleNumber}</p>
                                    <p className="text-xs text-neutral-500 mt-1">{p.ticketId} • {formatDateTime(p.entryTime)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <p className="text-lg font-bold text-neutral-900">{formatCurrency(p.amount)}</p>
                                {p.status === 'paid' ? (
                                    <span className="px-3 py-1.5 bg-success-100 text-success-700 text-xs font-semibold rounded-full">✓ Verified</span>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="success"
                                        onClick={() => handleVerify(p.ticketId)}
                                        loading={verifying === p.ticketId}
                                    >
                                        Mark Paid
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PaymentVerification;
