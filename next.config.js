/** @type {import('next').NextConfig} */
const { withGluestackUI } = require('@gluestack/ui-next-adapter');

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  transpilePackages: ["nativewind", "react-native-css-interop"]
};

const gluestackConfig = withGluestackUI(nextConfig);

// The v3 adapter emits Turbopack options, but this Next 16 project explicitly
// uses Webpack, so strip incompatible keys while keeping the adapter setup.
delete gluestackConfig.turbopack;
delete gluestackConfig.compiler?.define;
delete gluestackConfig.env?.DEV;

module.exports = gluestackConfig;
