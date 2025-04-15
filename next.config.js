/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: process.env.NEXT_PUBLIC_IONOS_HOST_NAME ?? 'localhost',
            },
        ],
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.externals = {
                ...config.externals,
                'uglify-js': 'uglify-js',
            };
        }
        return config;
    },
};
