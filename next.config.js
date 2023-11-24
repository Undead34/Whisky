/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: () => [
    {
      source: '/:dashboard*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store',
        },
      ],
    },
  ],
}


module.exports = nextConfig
