import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: { formats: ['image/avif', 'image/webp'] },

  // postgres and sharp are Node-only (sharp is native). Keep them unbundled so
  // Node requires them at runtime.
  serverExternalPackages: ['postgres', 'sharp'],

  // React Compiler is stable in Next 16 but opt-in — it memoises components
  // automatically at the cost of slower builds. Enable once the site is stable:
  //   npm install babel-plugin-react-compiler@latest
  // reactCompiler: true,
};

export default nextConfig;
