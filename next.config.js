/** @type {import('next').NextConfig} */
module.exports = {
    allowedDevOrigins: ['192.168.10.93', '172.20.10.4', 'localhost'],
    reactStrictMode: true,
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb',
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: process.env.NEXT_PUBLIC_IONOS_HOST_NAME ?? 'localhost',
            },
        ],
    },
};
