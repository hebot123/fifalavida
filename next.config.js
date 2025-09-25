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
  // Remove 'mdx' and 'md' from this array.
  pageExtensions: ['ts', 'tsx'],
  images: { domains: [] },
};

module.exports = withMDX(nextConfig);
