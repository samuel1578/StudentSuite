import { useEffect, useState, RefObject } from 'react';

interface Options extends IntersectionObserverInit {
    once?: boolean;
}

export default function useInView<T extends HTMLElement>(
    ref: RefObject<T>,
    { threshold = 0.1, root = null, rootMargin = '0px', once = true }: Options = {}
) {
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const el = ref?.current;
        if (!el) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    if (once) {
                        observer.disconnect();
                    }
                } else if (!once) {
                    setIsInView(false);
                }
            });
        }, { threshold, root, rootMargin });

        observer.observe(el);
        return () => observer.disconnect();
    }, [ref, threshold, root, rootMargin, once]);

    return isInView;
}
