/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://civil-willie-samawong-07bedc4e.koyeb.app/v1/:path*',
                headers: {
                  'Authorization': `Bearer ${process.env.API_KEY}`,
                },
              },
        ]
    },
    experimental: {
        serverActions: true,
      },
};

export default nextConfig;
