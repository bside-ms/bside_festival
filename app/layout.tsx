import Footer from 'components/common/Footer';
import PageHeader from 'components/common/PageHeader';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'B-Side Festival 2025',
    description: 'B-Side Festival 2025',
    openGraph: {
        title: 'B-Side Festival 2025',
        description: 'B-Side Festival 2025',
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
        <html lang="de">
            <head />
            <body className="bg-[#eaebeb] font-sans">
                <PageHeader />

                {children}

                <Footer />
            </body>
        </html>
    );
}
