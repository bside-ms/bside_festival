import AppShell from '@/components/common/AppShell';
import Footer from '@/components/common/Footer';
import InternHeaderNav from '@/components/common/InternHeaderNav';
import type { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';

export const metadata: Metadata = {
    title: 'B-Side Festival 2026',
    description: 'B-Side Festival 2026',
    openGraph: {
        title: 'B-Side Festival 2026',
        description: 'B-Side Festival 2026',
        images: ['https://festival.b-side.ms/assets/images/festival/19-537-min.jpg'],
        type: 'website',
        locale: 'de_DE',
    },
    icons: {
        icon: [
            { url: '/favicon.ico' },
            { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
            { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: [{ url: '/apple-touch-icon.png' }],
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="de" className="scroll-pt-15 scroll-smooth" data-scroll-behavior="smooth">
            <head />
            <body className="flex min-h-screen flex-col font-sans">
                <NuqsAdapter>
                    <AppShell internNav={<InternHeaderNav />} footer={<Footer />}>
                        {children}
                    </AppShell>
                </NuqsAdapter>
            </body>
        </html>
    );
}
