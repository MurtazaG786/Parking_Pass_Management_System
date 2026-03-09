import { Loader2, AlertCircle, InboxIcon } from 'lucide-react';

// Full page spinner
export const PageLoader = ({ message = 'Loading...' }) => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full animate-spin opacity-20" />
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin relative z-10" />
            </div>
            <p className="text-sm font-medium text-neutral-600">{message}</p>
        </div>
    </div>
);

// Skeleton card
export const SkeletonCard = () => (
    <div className="bg-white rounded-lg border border-neutral-100 p-5 animate-pulse shadow-card">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-neutral-200 rounded-lg" />
            <div className="flex-1">
                <div className="h-3 bg-neutral-200 rounded w-1/3 mb-2" />
                <div className="h-5 bg-neutral-200 rounded w-1/2" />
            </div>
        </div>
        <div className="h-2 bg-neutral-200 rounded w-full" />
    </div>
);

// Skeleton table row
export const SkeletonRow = ({ cols = 5 }) => (
    <tr className="animate-pulse border-b border-neutral-100 hover:bg-neutral-50">
        {Array.from({ length: cols }).map((_, i) => (
            <td key={i} className="px-4 py-3 first:pl-6 last:pr-6">
                <div className="h-4 bg-neutral-200 rounded w-3/4" />
            </td>
        ))}
    </tr>
);

// Empty state
export const EmptyState = ({ icon: Icon, title, description, action }) => (
    <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
            {Icon ? (
                <Icon className="w-8 h-8 text-primary-400" />
            ) : (
                <InboxIcon className="w-8 h-8 text-primary-400" />
            )}
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-1.5">{title}</h3>
        <p className="text-sm text-neutral-500 text-center max-w-xs mb-4">{description}</p>
        {action && action}
    </div>
);

// Error state
export const ErrorState = ({ message, onRetry, title = 'Something went wrong' }) => (
    <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-16 h-16 bg-danger-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-danger-500" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-1.5">{title}</h3>
        <p className="text-sm text-neutral-600 text-center max-w-xs mb-6">{message || 'An unexpected error occurred. Please try again.'}</p>
        {onRetry && (
            <button
                onClick={onRetry}
                className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
                Try Again
            </button>
        )}
    </div>
);

const Loader = PageLoader;
export default Loader;
