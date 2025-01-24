/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/voices',
                destination: 'https://civil-willie-samawong-07bedc4e.koyeb.app/v1/voices'
            },
            {
                source: '/api/convert',
                destination: 'https://civil-willie-samawong-07bedc4e.koyeb.app/v1/audio/speech'
            }
        ]
    },
    experimental: {
        serverActions: true,
      },
};

export default nextConfig;
