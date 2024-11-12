import createNextIntlPlugin from 'next-intl/plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import withPWAInit from '@ducanh2912/next-pwa';

const withNextIntl = createNextIntlPlugin();
const withPWA = withPWAInit({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
});
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test && rule.test.test?.('.svg')
    );

    if (fileLoaderRule) {
      config.module.rules.push(
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/, 
        },
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: { not: [/.url/] }, // exclude if *.svg?url
          use: ['@svgr/webpack'],
        }
      );

      // Modify the file loader rule to ignore *.svg, since we have it handled now.
      fileLoaderRule.exclude = /\.svg$/i;
    }

    config.plugins.push(
      new ESLintPlugin({
        context: './', // Location where it will scan all the files
        extensions: ['js', 'jsx', 'ts', 'tsx'], // File formats that should be scanned
        exclude: ['node_modules', 'dist'], // Exclude everything in these folders
      })
    );
    return config;
  },
};

export default withPWA(withNextIntl(nextConfig));
