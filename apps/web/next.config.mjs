/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@workspace/ui'],
    serverExternalPackages: ['@workspace/database'],
};

export default nextConfig;
