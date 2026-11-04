import { getAllPosts, getAllCategories, SITE_URL } from "@/lib/data";

export async function GET() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const today = new Date().toISOString().split("T")[0];

  const urls: { loc: string; priority: string; changefreq: string }[] = [
    { loc: `${SITE_URL}/`, priority: "1.0", changefreq: "daily" },
    { loc: `${SITE_URL}/hola-hablamos/`, priority: "0.7", changefreq: "monthly" },
    { loc: `${SITE_URL}/politica-privacidad/`, priority: "0.3", changefreq: "yearly" },
    { loc: `${SITE_URL}/politica-de-cookies/`, priority: "0.3", changefreq: "yearly" },
    { loc: `${SITE_URL}/aviso-legal/`, priority: "0.3", changefreq: "yearly" },
  ];

  for (const cat of categories) {
    urls.push({
      loc: `${SITE_URL}/${cat.slug}/`,
      priority: cat.slug === "resenas" || cat.slug === "curiosidades" ? "0.9" : "0.85",
      changefreq: "weekly",
    });
  }

  for (const post of posts) {
    urls.push({
      loc: `${SITE_URL}/${post.category}/${post.slug}/`,
      priority: post.isTopSeo ? "0.95" : "0.8",
      changefreq: "monthly",
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
