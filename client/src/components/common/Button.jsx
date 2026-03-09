import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg active:shadow-md',
    primaryLight: 'bg-primary-50 hover:bg-primary-100 text-primary-600 shadow-md hover:shadow-lg',
    secondary: 'bg-primary-400 hover:bg-primary-500 text-white shadow-md hover:shadow-lg',
    success: 'bg-success-500 hover:bg-success-600 text-white shadow-md hover:shadow-lg',
    danger: 'bg-danger-500 hover:bg-danger-600 text-white shadow-md hover:shadow-lg',
    warning: 'bg-warning-500 hover:bg-warning-600 text-white shadow-md hover:shadow-lg',
    ghost: 'bg-transparent hover:bg-surface-100 text-text-primary',
    outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 hover:border-primary-600',
    outlineGray: 'border border-surface-200 text-text-primary hover:bg-surface-100 hover:border-surface-300',
};

const sizes = {
    xs: 'px-2.5 py-1.5 text-xs font-medium rounded-md',
    sm: 'px-3 py-1.5 text-xs font-medium rounded-lg',
    md: 'px-4 py-2 text-sm font-medium rounded-lg',
    lg: 'px-6 py-2.5 text-base font-medium rounded-lg',
    xl: 'px-8 py-3 text-base font-medium rounded-lg',
};

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon: Icon,
    className = '',
    onClick,
    type = 'button',
    fullWidth = false,
    ...props
}) => {
    return (
        <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                Icon && <Icon className="w-4 h-4" />
            )}
            {children}
        </motion.button>
    );
};

export default Button;
