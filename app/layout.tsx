import '../styles/globals.css';
import NextHead from '../components/common/NextHead';
import { ReactNode } from 'react';

export const metadata = {
    title: 'B-Side Festival 2024',
    description: 'B-Side Festival 2024',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="de">
            <head>
                <NextHead title="B-Side Festival 2024" />
            </head>
            <body>{children}</body>
        </html>
    );
}
