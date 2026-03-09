import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef((
    {
        label,
        error,
        icon: Icon,
        hint,
        required,
        className = '',
        type = 'text',
        size = 'md',
        ...props
    },
    ref
) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const sizeClasses = {
        sm: 'px-2.5 py-1.5 text-xs',
        md: 'px-3.5 py-2.5 text-sm',
        lg: 'px-4 py-3 text-base',
    };

    const isPasswordField = type === 'password';
    const inputType = isPasswordField && showPassword ? 'text' : type;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    {label}
                    {required && <span className="text-danger-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="w-4 h-4 text-neutral-400" />
                    </div>
                )}
                <input
                    ref={ref}
                    type={inputType}
                    className={`w-full rounded-lg border bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-surface-50 disabled:cursor-not-allowed ${
                        Icon ? 'pl-10' : ''
                    } ${
                        isPasswordField ? 'pr-10' : ''
                    } ${
                        error
                            ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500 text-danger-900'
                            : 'border-surface-200 hover:border-primary-300 focus:ring-primary-400 focus:border-primary-500'
                    } ${sizeClasses[size]}`}
                    {...props}
                />
                {isPasswordField && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-primary-600 transition-colors"
                    >
                        {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                        ) : (
                            <Eye className="w-4 h-4" />
                        )}
                    </button>
                )}
            </div>
            {error ? (
                <p className="mt-1.5 text-xs font-medium text-danger-600">{error}</p>
            ) : hint ? (
                <p className="mt-1.5 text-xs text-neutral-500">{hint}</p>
            ) : null}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;
