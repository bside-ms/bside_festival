export const getPageHash = (href: string): string | undefined => {
    const hashIndex = href.indexOf('#');
    if (hashIndex === -1 || hashIndex === href.length - 1) {
        return undefined;
    }

    return href.slice(hashIndex + 1);
};

export const scrollToPageHash = (hash: string): boolean => {
    const target = document.getElementById(hash);
    if (target === null) {
        return false;
    }

    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    target.scrollIntoView({ behavior, block: 'start' });
    return true;
};
