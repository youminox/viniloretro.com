import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  experimental: {
    inlineCss: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "viniloretro.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      // Legacy WordPress Sitemaps & Sub-Sitemaps -> Next.js Sitemap
      {
        source: "/wp-sitemap/:path*",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/wp-sitemap-:slug/",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/wp-sitemap-:slug",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/sitemap_index.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/sitemap_index.xml/",
        destination: "/sitemap.xml",
        permanent: true,
      },
      // WordPress root pagination & category pagination compatibility
      {
        source: "/page/:page/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/page/:page",
        destination: "/",
        permanent: true,
      },
      {
        source: "/category/:slug/page/:page/",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/category/:slug/page/:page",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/category/:slug/",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/category/:slug",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/:slug/page/:page/",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/:slug/page/:page",
        destination: "/:slug/",
        permanent: true,
      },
      // Legacy WordPress author, tag, feed & attachment URLs
      {
        source: "/author/:path*",
        destination: "/hola-hablamos/",
        permanent: true,
      },
      {
        source: "/tag/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/comments/feed/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/comments/feed",
        destination: "/",
        permanent: true,
      },
      {
        source: "/privacy-policy/feed/",
        destination: "/politica-privacidad/",
        permanent: true,
      },
      {
        source: "/privacy-policy/feed",
        destination: "/politica-privacidad/",
        permanent: true,
      },
      {
        source: "/feed/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/feed",
        destination: "/",
        permanent: true,
      },
      {
        source: "/:category/:slug/feed/",
        destination: "/:category/:slug/",
        permanent: true,
      },
      {
        source: "/:category/:slug/feed",
        destination: "/:category/:slug/",
        permanent: true,
      },
      {
        source: "/:category/feed/",
        destination: "/:category/",
        permanent: true,
      },
      {
        source: "/:category/feed",
        destination: "/:category/",
        permanent: true,
      },
      {
        source: "/cluster/attachment/:att*/",
        destination: "/resenas/",
        permanent: true,
      },
      {
        source: "/cluster/attachment/:att*",
        destination: "/resenas/",
        permanent: true,
      },
      {
        source: "/cluster/",
        destination: "/resenas/",
        permanent: true,
      },
      {
        source: "/cluster",
        destination: "/resenas/",
        permanent: true,
      },
      {
        source: "/hola-hablamos/attachment/:att*/",
        destination: "/hola-hablamos/",
        permanent: true,
      },
      {
        source: "/hola-hablamos/attachment/:att*",
        destination: "/hola-hablamos/",
        permanent: true,
      },
      {
        source: "/:category/:slug/attachment/:att*/",
        destination: "/:category/:slug/",
        permanent: true,
      },
      {
        source: "/:category/:slug/attachment/:att*",
        destination: "/:category/:slug/",
        permanent: true,
      },
      {
        source: "/:slug/attachment/:att*/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/:slug/attachment/:att*",
        destination: "/",
        permanent: true,
      },
      // Legacy WordPress root-level media attachment slugs & uncategorized slug redirects
      {
        source: "/photo-by-james-yarema/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/photo-by-james-yarema",
        destination: "/",
        permanent: true,
      },
      {
        source: "/photo-by-david-lozano/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/photo-by-david-lozano",
        destination: "/",
        permanent: true,
      },
      {
        source: "/vinilo-retro/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/vinilo-retro",
        destination: "/",
        permanent: true,
      },
      {
        source: "/disco-de-vinilo/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/disco-de-vinilo",
        destination: "/",
        permanent: true,
      },
      {
        source: "/que-fue-primero-el-disco-de-acetato-o-el-cassette/",
        destination: "/curiosidades/que-fue-primero-el-disco-de-acetato-o-el-cassette/",
        permanent: true,
      },
      {
        source: "/que-fue-primero-el-disco-de-acetato-o-el-cassette",
        destination: "/curiosidades/que-fue-primero-el-disco-de-acetato-o-el-cassette/",
        permanent: true,
      },
      // Legacy WordPress media uploads path -> local optimized images
      {
        source: "/wp-content/uploads/:year/:month/:file/",
        destination: "/images/:file",
        permanent: true,
      },
      {
        source: "/wp-content/uploads/:year/:month/:file",
        destination: "/images/:file",
        permanent: true,
      },
      // Common legal & contact aliases
      {
        source: "/privacy-policy/",
        destination: "/politica-privacidad/",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/politica-privacidad/",
        permanent: true,
      },
      {
        source: "/politica-de-privacidad/",
        destination: "/politica-privacidad/",
        permanent: true,
      },
      {
        source: "/politica-de-privacidad",
        destination: "/politica-privacidad/",
        permanent: true,
      },
      {
        source: "/contacto/",
        destination: "/hola-hablamos/",
        permanent: true,
      },
      {
        source: "/contacto",
        destination: "/hola-hablamos/",
        permanent: true,
      },
      // Legacy WordPress Home page slug & empty blog category
      {
        source: "/366-2/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/366-2",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog/",
        destination: "/curiosidades/",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/curiosidades/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
