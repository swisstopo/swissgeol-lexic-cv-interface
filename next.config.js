/** @type {import('next').NextConfig} */
const { withGluestackUI } = require('@gluestack/ui-next-adapter');

const nextConfig = {
  reactStrictMode: true,
  output: "standalone"
};

module.exports = withGluestackUI(nextConfig);
