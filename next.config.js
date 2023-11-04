/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,  
    images: {
        formats:['image/avif','image/webp'],
        remotePatterns: [
          {
            protocol: "https",
            hostname: "res.cloudinary.com",
            port: "",
            pathname: "/**",
          },
        ],
      },
}

module.exports = nextConfig
