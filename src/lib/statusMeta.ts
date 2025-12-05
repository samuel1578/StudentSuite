export type BookingStatus = 'pending' | 'accepted' | 'awaiting_payment' | 'finished';

export const STATUS_META: Record<BookingStatus, { label: string; description: string; bg: string; text: string; ring?: string }> = {
    pending: {
        label: 'Pending',
        description: 'Booking received. Awaiting admin review and confirmation.',
        bg: 'bg-yellow-100 dark:bg-yellow-900/20',
        text: 'text-yellow-800 dark:text-yellow-300',
        ring: 'ring-yellow-300/40'
    },
    accepted: {
        label: 'Accepted',
        description: 'Booking approved. Await further instructions.',
        bg: 'bg-emerald-100 dark:bg-emerald-900/20',
        text: 'text-emerald-800 dark:text-emerald-300',
        ring: 'ring-emerald-300/40'
    },
    awaiting_payment: {
        label: 'Awaiting Payment',
        description: 'Booking approved but payment is pending. Please complete payment to confirm reservation.',
        bg: 'bg-amber-100 dark:bg-amber-900/20',
        text: 'text-amber-800 dark:text-amber-300',
        ring: 'ring-amber-300/40'
    },
    finished: {
        label: 'Finished',
        description: 'Stay complete. Thank you for staying with us.',
        bg: 'bg-sky-100 dark:bg-sky-900/20',
        text: 'text-sky-800 dark:text-sky-300',
        ring: 'ring-sky-300/40'
    }
};
