/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/voices',
                destination: 'http://192.168.123.250:5050/v1/voices'
            },
            {
                source: '/api/convert',
                destination: 'http://192.168.123.250:5050/v1/audio/speech'
            }
        ]
    },
    experimental: {
        serverActions: true,
      },
};

export default nextConfig;
