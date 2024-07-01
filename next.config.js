/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'i.ibb.co' },
      { hostname: 'res.cloudinary.com' },
    ],
  },
};

module.exports = nextConfig;
