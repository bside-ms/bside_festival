'use client';

import { type ReactElement, useEffect, useRef } from 'react';

const FundraisingBox = ({ hash }: { hash: string }): ReactElement => {
    const containerRef = useRef<HTMLDivElement>(null);
    const injectedRef = useRef(false);

    useEffect(() => {
        // Guard against React StrictMode's double-invoke (and any re-render)
        // injecting the snippet — and thus a second form — more than once.
        if (injectedRef.current || containerRef.current === null) {
            return;
        }
        injectedRef.current = true;

        const snippet = `<script type="text/javascript" src="https://secure.fundraisingbox.com/app/paymentJS?hash=${hash}"></script>`;
        const fragment = document.createRange().createContextualFragment(snippet);
        containerRef.current.append(fragment);
    }, [hash]);

    return (
        <div>
            <div id="fbIframeDiv" ref={containerRef} className="relative" />
            <noscript>Bitte aktiviere JavaScript, um das Spendenformular zu sehen.</noscript>

            <a target="_blank" href="https://www.fundraisingbox.com" rel="noopener noreferrer" className="mt-3 flex justify-center">
                <img src="https://secure.fundraisingbox.com/images/FundraisingBox-Logo-Widget.png" alt="FundraisingBox Logo" />
            </a>
        </div>
    );
};

export default FundraisingBox;
