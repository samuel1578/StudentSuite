import React, { ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const closeButtonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKey);
            // lock body scroll
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            // focus the close button
            setTimeout(() => closeButtonRef.current?.focus(), 10);
            return () => {
                document.removeEventListener('keydown', handleKey);
                document.body.style.overflow = originalOverflow;
            };
        }
        return () => { };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label={title ?? 'Dialog'}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            <div className="absolute inset-0 bg-black/60 transition-opacity" onClick={onClose} />

            <div className="relative z-10 w-full max-w-4xl rounded-xl bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <button
                        ref={closeButtonRef}
                        onClick={onClose}
                        aria-label="Close dialog"
                        className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        Close
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
