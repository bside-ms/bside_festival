/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    experimental: {
        scrollRestoration: true
    },
    async redirects() {

        return [
            // Temporarily redirect content routes to the front page
            { source: '/(artists|awareness|bewerbung| mithelfen|orte|programm)(.*)', destination: '/', permanent: false },

            // This is used so the images of the leaflet map are shown, not sure
            // how to tell leaflet to use a different path for its images instead.
            { source: '/layers-2x.png', destination: '/assets/leaflet/layers-2x.png', permanent: true },
            { source: '/layers.png', destination: '/assets/leaflet/layers.png', permanent: true },
            { source: '/marker-icon-2x.png', destination: '/assets/leaflet/marker-icon-2x.png', permanent: true },
            { source: '/marker-icon.png', destination: '/assets/leaflet/marker-icon.png', permanent: true },
            { source: '/marker-shadow.png', destination: '/assets/leaflet/marker-shadow.png', permanent: true },
            { source: '/orte/layers-2x.png', destination: '/assets/leaflet/layers-2x.png', permanent: true },
            { source: '/orte/layers.png', destination: '/assets/leaflet/layers.png', permanent: true },
            { source: '/orte/marker-icon-2x.png', destination: '/assets/leaflet/marker-icon-2x.png', permanent: true },
            { source: '/orte/marker-icon.png', destination: '/assets/leaflet/marker-icon.png', permanent: true },
            { source: '/orte/marker-shadow.png', destination: '/assets/leaflet/marker-shadow.png', permanent: true },
        ]
    }
};
