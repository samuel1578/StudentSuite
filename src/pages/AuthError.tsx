import { useMemo } from 'react';
import { useRouter } from '../context/RouterContext';

export default function AuthError() {
    const { navigate } = useRouter();
    const message = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('message') ?? 'We could not complete your sign in. Please try again.';
    }, []);

    const handleRetry = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full rounded-3xl border border-gray-200 bg-white p-8 shadow-xl shadow-rose-500/10 text-center dark:border-gray-800 dark:bg-gray-900">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Authentication Error</h1>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{message}</p>
                <button
                    type="button"
                    onClick={handleRetry}
                    className="mt-6 inline-flex items-center justify-center rounded-xl bg-rose-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
