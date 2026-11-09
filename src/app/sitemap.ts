import type { MetadataRoute } from "next";
import { getAllPosts, getAllCategories, SITE_URL } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/hola-hablamos/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/mapa-del-sitio/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/politica-privacidad/`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/politica-de-cookies/`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/aviso-legal/`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/${cat.slug}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority:
      cat.slug === "resenas" || cat.slug === "curiosidades" ? 0.9 : 0.85,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/${post.category}/${post.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: post.isTopSeo ? 0.95 : 0.8,
  }));

  return [...staticPages, ...categoryPages, ...postPages];
}
