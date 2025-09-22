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
};

module.exports = withMDX(nextConfig);
