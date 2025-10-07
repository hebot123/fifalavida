/** @type {import('next').NextConfig} */
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    providerImportSource: '@mdx-js/react',
  },
});

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx', 'md'],
  images: { domains: [] },
  async redirects() {
    return [
      { source: '/', destination: '/updates', permanent: false },
    ];
  },
};

module.exports = withMDX(nextConfig);
