import { useEffect, useState, type FormEvent } from 'react';
import { Account, Databases, ID } from 'appwrite';
import client from '../appwrite';
import { useRouter } from '../context/RouterContext';
import type { PasswordUpdateRequest, UserProfile, EmergencyContact } from '../types';
import {
    AlertTriangle,
    BookOpen,
    Check,
    Loader2,
    MapPin,
    Phone,
    Save,
    User,
    X,
    Key,
    Eye,
    EyeOff
} from 'lucide-react';

// Constants
const WIZARD_STORAGE_KEY = 'profile-wizard-state';

interface WizardState {
    currentStep: number;
    furthestStep: number;
    formState: Partial<UserProfile & { emergencyContact: EmergencyContact }>;
}

// Initialize Appwrite services
const account = new Account(client);
const databases = client ? new Databases(client) : null;

// Check if environment variables are ready
const envReady = !!client;

// Step configuration
const steps = [
    {
        title: 'Identity',
        description: 'Personal Information',
        icon: User,
    },
    {
        title: 'Housing',
        description: 'Room Assignment',
        icon: MapPin,
    },
    {
        title: 'Security',
        description: 'Emergency Contact',
        icon: Phone,
    },
];

// StepIndicator component
interface StepIndicatorProps {
    currentStep: number;
    furthestStep?: number;
    onStepSelect?: (step: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, furthestStep = currentStep, onStepSelect }) => (
    <div className="flex items-center justify-between">
        {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < furthestStep;
            const isAccessible = index <= furthestStep;

            return (
                <div key={index} className="flex items-center">
                    <button
                        onClick={() => onStepSelect && isAccessible && onStepSelect(index)}
                        disabled={!isAccessible}
                        className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold transition-all ${isActive
                            ? 'bg-rose-600 text-white shadow-lg'
                            : isCompleted
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : isAccessible
                                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </button>
                    {index < steps.length - 1 && (
                        <div
                            className={`h-px w-16 transition-all ${index < furthestStep ? 'bg-emerald-600' : 'bg-gray-200'
                                }`}
                        />
                    )}
                </div>
            );
        })}
    </div>
);

export default function Profile() {
    const { navigate } = useRouter();

    // State management
    const [isWizardOpen, setIsWizardOpen] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [furthestStep, setFurthestStep] = useState(0);
    const [formState, setFormState] = useState<Partial<UserProfile & { emergencyContact: EmergencyContact }>>({
        fullName: '',
        email: '',
        phone: '',
        preferredName: '',
        level: '',
        emergencyContact: {
            name: '',
            relationship: '',
            phone: ''
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Password form state
    const [passwordForm, setPasswordForm] = useState<PasswordUpdateRequest>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    // Load wizard state on mount
    useEffect(() => {
        const savedState = loadWizardProgress();
        if (savedState) {
            setCurrentStep(savedState.currentStep);
            setFurthestStep(savedState.furthestStep);
            setFormState(savedState.formState);
        }
    }, []);

    // Persistence functions
    const persistWizardProgress = () => {
        const state: WizardState = {
            currentStep,
            furthestStep,
            formState
        };
        localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(state));
    };

    const loadWizardProgress = (): WizardState | null => {
        try {
            const saved = localStorage.getItem(WIZARD_STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    };

    const clearWizardStorage = () => {
        localStorage.removeItem(WIZARD_STORAGE_KEY);
    };

    // Event handlers
    const handleCloseWizard = () => {
        persistWizardProgress();
        setIsWizardOpen(false);
    };

    const handleResumeWizard = () => {
        setIsWizardOpen(true);
    };

    const handleStepSelect = (step: number) => {
        if (step <= furthestStep) {
            setCurrentStep(step);
            persistWizardProgress();
        }
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            setFurthestStep(Math.max(furthestStep, nextStep));
            persistWizardProgress();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            persistWizardProgress();
        }
    };

    const handleFieldChange = (field: string, value: string) => {
        if (field.startsWith('emergencyContact.')) {
            const contactField = field.split('.')[1];
            setFormState(prev => ({
                ...prev,
                emergencyContact: {
                    ...prev.emergencyContact,
                    [contactField]: value
                } as EmergencyContact
            }));
        } else {
            setFormState(prev => ({ ...prev, [field]: value }));
        }
        persistWizardProgress();
    };

    const handlePasswordFieldChange = (field: keyof PasswordUpdateRequest, value: string) => {
        setPasswordForm(prev => ({ ...prev, [field]: value }));
        setPasswordError(null);
    };

    const handlePasswordSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordMessage(null);

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
            return;
        }

        if (!envReady) {
            setPasswordError('Database connection not available');
            return;
        }

        try {
            setIsLoading(true);
            await account.updatePassword(passwordForm.newPassword, passwordForm.currentPassword);
            setPasswordMessage('Password updated successfully');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setPasswordError((error as Error).message || 'Failed to update password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitProfile = async () => {
        if (!envReady) {
            setSuccessMessage('Profile saved locally (database not connected)');
            clearWizardStorage();
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await databases!.createDocument(
                process.env.VITE_APPWRITE_DATABASE_ID!,
                process.env.VITE_APPWRITE_PROFILES_COLLECTION_ID!,
                ID.unique(),
                {
                    ...formState,
                    updatedAt: new Date().toISOString()
                }
            );
            setSuccessMessage('Profile saved successfully!');
            clearWizardStorage();
        } catch (error) {
            setError((error as Error).message || 'Failed to save profile');
        } finally {
            setIsLoading(false);
        }
    };

    // Step content renderer
    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={formState.fullName || ''}
                                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Preferred Name
                                </label>
                                <input
                                    type="text"
                                    value={formState.preferredName || ''}
                                    onChange={(e) => handleFieldChange('preferredName', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="What should we call you?"
                                />
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={formState.email || ''}
                                    onChange={(e) => handleFieldChange('email', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="your.email@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formState.phone || ''}
                                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Academic Level
                            </label>
                            <select
                                value={formState.level || ''}
                                onChange={(e) => handleFieldChange('level', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="">Select your level</option>
                                <option value="Freshman">Freshman</option>
                                <option value="Sophomore">Sophomore</option>
                                <option value="Junior">Junior</option>
                                <option value="Senior">Senior</option>
                                <option value="Graduate">Graduate</option>
                            </select>
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="space-y-6">
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Room Assignment</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Your room assignment will be displayed here once available.
                                Contact housing services for more information.
                            </p>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Status: Pending Assignment
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Password Security</h3>
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.current ? 'text' : 'password'}
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => handlePasswordFieldChange('currentPassword', e.target.value)}
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-gray-900 focus:border-rose-500 focus:ring-rose-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                            placeholder="Enter current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.new ? 'text' : 'password'}
                                            value={passwordForm.newPassword}
                                            onChange={(e) => handlePasswordFieldChange('newPassword', e.target.value)}
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-gray-900 focus:border-rose-500 focus:ring-rose-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.confirm ? 'text' : 'password'}
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => handlePasswordFieldChange('confirmPassword', e.target.value)}
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-gray-900 focus:border-rose-500 focus:ring-rose-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                {(passwordError || passwordMessage) && (
                                    <div className={`rounded-xl border p-4 text-sm ${passwordError
                                        ? 'border-red-200 bg-red-50 text-red-800'
                                        : 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-600 dark:text-emerald-200'
                                        }`}>
                                        {passwordError || passwordMessage}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                                    className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                                    Update Password
                                </button>
                            </form>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Emergency Contact</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Please provide contact information for someone we can reach in case of an emergency.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Contact Name *
                                </label>
                                <input
                                    type="text"
                                    value={formState.emergencyContact?.name || ''}
                                    onChange={(e) => handleFieldChange('emergencyContact.name', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="Full name of emergency contact"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Relationship *
                                </label>
                                <select
                                    value={formState.emergencyContact?.relationship || ''}
                                    onChange={(e) => handleFieldChange('emergencyContact.relationship', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                >
                                    <option value="">Select relationship</option>
                                    <option value="Parent">Parent</option>
                                    <option value="Guardian">Guardian</option>
                                    <option value="Sibling">Sibling</option>
                                    <option value="Spouse">Spouse</option>
                                    <option value="Friend">Friend</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    value={formState.emergencyContact?.phone || ''}
                                    onChange={(e) => handleFieldChange('emergencyContact.phone', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // Main render function
    return (
        <div className="pt-[115px] pb-16 md:pt-12 md:pb-12 min-h-screen bg-gray-50 dark:bg-gray-950 relative">
            {isWizardOpen && (
                <div className="fixed inset-0 z-40 overflow-y-auto bg-black/70 backdrop-blur-sm">
                    <div className="mx-auto max-w-6xl px-4 py-10">
                        <div className="relative rounded-[32px] border border-white/20 bg-white/95 p-4 shadow-2xl dark:border-gray-800 dark:bg-gray-900/95">
                            <button
                                type="button"
                                onClick={handleCloseWizard}
                                className="absolute right-6 top-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-lg hover:text-rose-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                aria-label="Close profile setup"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <div className="space-y-8 px-4 py-6 sm:px-8">
                                <header className="rounded-3xl bg-gradient-to-r from-rose-600 to-orange-500 px-6 py-10 text-white shadow-xl">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.3em] text-white/70">Profile Setup</p>
                                            <h1 className="mt-2 text-3xl font-semibold">Design your Student Suite identity</h1>
                                            <p className="mt-2 text-white/90 max-w-2xl">
                                                Flow through three guided moments to tell us who you are, how you are living on campus, and who we can reach in case of emergencies.
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => navigate('/dashboard')}
                                                className="rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur"
                                            >
                                                Back to Menu
                                            </button>
                                        </div>
                                    </div>
                                </header>

                                {!envReady && (
                                    <div className="rounded-2xl border border-amber-300 bg-amber-50/70 p-4 flex gap-3 text-amber-800">
                                        <AlertTriangle className="h-5 w-5" />
                                        <div>
                                            <p className="font-semibold">Appwrite environment variables missing</p>
                                            <p className="text-sm">Profile updates will be stored locally until the database configuration is complete.</p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                                    <div className="space-y-6">
                                        <StepIndicator currentStep={currentStep} furthestStep={furthestStep} onStepSelect={handleStepSelect} />

                                        {(error || successMessage) && (
                                            <div
                                                className={`rounded-2xl border p-4 text-sm ${error
                                                    ? 'border-red-200 bg-red-50 text-red-800'
                                                    : 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-600 dark:text-emerald-200'
                                                    }`}
                                            >
                                                {error || successMessage}
                                            </div>
                                        )}

                                        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="h-16 w-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl font-semibold dark:bg-rose-500/10 dark:text-rose-200">
                                                    {formState.fullName ? formState.fullName[0] : <User className="h-6 w-6" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm uppercase tracking-wide text-gray-500">{steps[currentStep].title}</p>
                                                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{steps[currentStep].description}</h2>
                                                </div>
                                            </div>

                                            {renderStepContent()}

                                            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <button
                                                    type="button"
                                                    onClick={handleBack}
                                                    disabled={currentStep === 0}
                                                    className={`rounded-full border px-6 py-3 text-sm font-semibold transition ${currentStep === 0
                                                        ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    Back
                                                </button>

                                                <div className="flex gap-3">
                                                    {currentStep === steps.length - 1 ? (
                                                        <button
                                                            type="button"
                                                            onClick={handleSubmitProfile}
                                                            disabled={isLoading}
                                                            className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                                                        >
                                                            {isLoading ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Save className="h-4 w-4" />
                                                            )}
                                                            Save Profile
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={handleNext}
                                                            className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-700"
                                                        >
                                                            Next Step
                                                            <BookOpen className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progress Overview</h3>
                                            <div className="space-y-4">
                                                {steps.map((step, index) => {
                                                    const Icon = step.icon;
                                                    const isComplete = index < furthestStep;
                                                    const isCurrent = index === currentStep;

                                                    return (
                                                        <div key={index} className="flex items-center gap-3">
                                                            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${isCurrent
                                                                ? 'bg-rose-600 text-white'
                                                                : isComplete
                                                                    ? 'bg-emerald-600 text-white'
                                                                    : 'bg-gray-100 text-gray-500'
                                                                }`}>
                                                                {isComplete ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{step.title}</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!isWizardOpen && (
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Profile Setup Paused</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Your progress has been saved. You can resume setup at any time.</p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={handleResumeWizard}
                                className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-700"
                            >
                                <User className="h-4 w-4" />
                                Resume Setup
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}