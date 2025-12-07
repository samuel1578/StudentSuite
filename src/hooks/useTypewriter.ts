import { useEffect, useState } from 'react';

interface UseTypewriterOptions {
    typingSpeed?: number; // ms per char
    deletingSpeed?: number; // ms per char
    pause?: number; // ms pause between words
    loop?: boolean;
}

export default function useTypewriter(words: string[], options?: UseTypewriterOptions) {
    const { typingSpeed = 70, deletingSpeed = 40, pause = 1800, loop = true } = options || {};
    const [index, setIndex] = useState(0);
    const [display, setDisplay] = useState('');
    const [isDeleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!words || words.length === 0) return;
        const fullText = words[index];

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                setDisplay(fullText.slice(0, display.length + 1));
                if (display.length + 1 === fullText.length) {
                    // pause then start deleting
                    setTimeout(() => setDeleting(true), pause);
                }
            } else {
                setDisplay(fullText.slice(0, display.length - 1));
                if (display.length - 1 === 0) {
                    setDeleting(false);
                    setIndex((i) => (i + 1) % words.length);
                }
            }
        }, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [display, isDeleting, index, words, typingSpeed, deletingSpeed, pause, loop]);

    return display;
}
