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
        apple: [
            { url: '/apple-touch-icon.png' },
        ],
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="de">
            <head>
                <link rel="preconnect" href="https://use.typekit.net" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://use.typekit.net/hvw2qua.css" rel="stylesheet" />
                <link href="https://use.typekit.net/gbo5uob.css" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Questrial&display=swap" rel="stylesheet" />
            </head>
            <body className="font-sans">{children}</body>
        </html>
    );
}
