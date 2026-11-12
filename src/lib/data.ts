import postsData from "../../data/posts.json";
import pagesData from "../../data/pages.json";
import categoriesData from "../../data/categories.json";

export const SITE_NAME = "Vinilo Retro";
export const SITE_URL = "https://viniloretro.com";
export const SITE_DESCRIPTION =
  "Enciclopedia de los tocadiscos de vinilo y la música que marcó historia: comparativas de tornamesas, cuidado de agujas y los grandes íconos de los años 50, 60, 70, 80, 90 y la ópera.";
export const ADSENSE_CLIENT = "ca-pub-1070738569472471";
export const GA_ID = "G-GG0SYFNSK3";

export interface PostCategory {
  slug: string;
  name: string;
}

export interface InlineRelatedLink {
  url: string;
  title: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  category: string;
  categoryName: string;
  categories: PostCategory[];
  date: string;
  modified: string;
  readTime: string;
  content: string;
  excerpt: string;
  featuredImageId: number | null;
  featuredImageUrl: string;
  inlineRelated?: InlineRelatedLink[];
  isTopSeo?: boolean;
  type: string;
  status: string;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  parent: string;
  description: string;
  count: number;
}

const posts: Post[] = postsData as Post[];
const pages: Post[] = pagesData as Post[];
const categories: Category[] = categoriesData as Category[];

const postBySlugMap = new Map<string, Post>();
for (const p of posts) {
  postBySlugMap.set(p.slug, p);
}

const categoryBySlugMap = new Map<string, Category>();
for (const c of categories) {
  categoryBySlugMap.set(c.slug, c);
}

export function getAllPosts(): Post[] {
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return postBySlugMap.get(slug);
}

export function getAllCategories(): Category[] {
  return categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categoryBySlugMap.get(slug);
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return posts.filter(
    (p) =>
      p.category === categorySlug ||
      p.categories.some((c) => c.slug === categorySlug)
  );
}

export function getTopSeoPosts(limit = 12): Post[] {
  const topPosts = posts.filter((p) => p.isTopSeo);
  return topPosts.slice(0, limit);
}

const PRIORITY_TURNTABLE_SLUGS = [
  "cuando-dejaron-de-usarse-los-discos-de-vinilo-un-viaje-en-el-tiempo",
  "encuentra-el-tocadiscos-perfecto-en-el-corte-ingles",
  "encuentra-el-mejor-tocadiscos-de-vinilo-en-liverpool-guia-de-compra-definitiva",
  "explorando-la-nostalgia-como-se-llaman-las-maquinas-tocadiscos",
  "guia-completa-que-tener-en-cuenta-al-comprar-un-tocadiscos",
  "descubre-el-encanto-retro-con-un-tocadiscos-crosley",
  "tocadiscos-bluetooth-combina-nostalgia-y-tecnologia-en-un-solo-dispositivo",
  "encuentra-los-mejores-altavoces-para-tu-tocadiscos-calidad-de-sonido-inigualable",
  "como-saber-cuando-cambiar-la-pua-de-un-tocadiscos-consejos-y-senales",
  "descubre-la-aguja-perfecta-como-saber-que-aguja-comprar-para-tocadiscos",
  "el-arte-de-cuidar-un-tocadiscos-consejos-y-trucos",
  "conecta-tu-tocadiscos-facilmente-como-se-conecta-un-tocadiscos",
];

export function getFeaturedTurntableGuides(limit = 6): Post[] {
  const result: Post[] = [];
  for (const slug of PRIORITY_TURNTABLE_SLUGS) {
    const found = postBySlugMap.get(slug);
    if (found) {
      result.push(found);
    }
    if (result.length >= limit) break;
  }
  if (result.length < limit) {
    for (const p of posts) {
      if (
        (p.category === "resenas" || p.category === "curiosidades") &&
        !result.some((r) => r.id === p.id)
      ) {
        result.push(p);
        if (result.length >= limit) break;
      }
    }
  }
  return result;
}

export function getRecentPosts(limit = 24): Post[] {
  return posts.slice(0, limit);
}

export function getRelatedPosts(currentPost: Post, limit = 4): Post[] {
  const allInCat = posts.filter((p) => p.category === currentPost.category);
  const currentIdx = Math.max(
    0,
    allInCat.findIndex((p) => p.id === currentPost.id)
  );
  const sameCategory = allInCat.filter((p) => p.id !== currentPost.id);
  // Prioritize Top SEO posts within the same category first, then sequential neighbors
  const topInCat = sameCategory.filter((p) => p.isTopSeo);
  const regularInCat = sameCategory.filter((p) => !p.isTopSeo);
  const combined = [...topInCat, ...regularInCat];
  if (combined.length >= limit) {
    // Pick a deterministic slice based on sequential currentIdx so internal links cover 100% of all 1,895 posts
    const result: Post[] = [];
    if (topInCat.length > 0) {
      result.push(topInCat[currentIdx % topInCat.length]);
    }
    const startIdx = currentIdx % Math.max(1, regularInCat.length);
    for (let i = 0; i < regularInCat.length && result.length < limit; i++) {
      const candidate = regularInCat[(startIdx + i) % regularInCat.length];
      if (!result.some((r) => r.id === candidate.id)) {
        result.push(candidate);
      }
    }
    return result.slice(0, limit);
  }
  return combined.slice(0, limit);
}

export function getAdjacentPosts(currentPost: Post): {
  prev: Post | null;
  next: Post | null;
} {
  const allInCat = posts.filter((p) => p.category === currentPost.category);
  if (allInCat.length <= 1) {
    return { prev: null, next: null };
  }
  const idx = allInCat.findIndex((p) => p.id === currentPost.id);
  const safeIdx = idx >= 0 ? idx : 0;
  const prev = allInCat[(safeIdx - 1 + allInCat.length) % allInCat.length];
  const next = allInCat[(safeIdx + 1) % allInCat.length];
  return {
    prev: prev.id !== currentPost.id ? prev : null,
    next: next.id !== currentPost.id && next.id !== prev.id ? next : null,
  };
}

export function getContextualRelatedPosts(currentPost: Post, limit = 3): Post[] {
  const result: Post[] = [];

  // 1. First use extracted [aib_post_related] internal links if they match valid posts
  if (currentPost.inlineRelated && currentPost.inlineRelated.length > 0) {
    for (const item of currentPost.inlineRelated) {
      const parts = item.url.replace(/^\/|\/$/g, "").split("/");
      const targetSlug = parts[parts.length - 1];
      const targetPost = postBySlugMap.get(targetSlug);
      if (
        targetPost &&
        targetPost.id !== currentPost.id &&
        !result.some((r) => r.id === targetPost.id)
      ) {
        result.push(targetPost);
      }
      if (result.length >= limit) return result;
    }
  }

  // 2. Fallback to same category posts with different offset than sidebar relatedPosts
  const sameCat = posts.filter(
    (p) => p.id !== currentPost.id && p.category === currentPost.category
  );
  if (sameCat.length > 0) {
    const offset = (currentPost.id * 7) % sameCat.length;
    for (let i = 0; i < sameCat.length && result.length < limit; i++) {
      const candidate = sameCat[(offset + i) % sameCat.length];
      if (!result.some((r) => r.id === candidate.id)) {
        result.push(candidate);
      }
    }
  }

  return result;
}

export function getPageBySlug(slug: string): Post | undefined {
  return pages.find((p) => p.slug === slug);
}

export function getPostUrl(post: Post): string {
  return `/${post.category}/${post.slug}/`;
}

export function getImageUrl(url: string): string {
  if (!url) {
    return "/images/El-Renacer-del-Vinilo-La-Magia-de-los-Discos-de-Vinilo.jpg";
  }
  if (url.startsWith("/images/")) {
    return url;
  }
  const filename = url.split("/").pop()?.split("?")[0] || "";
  return `/images/${filename}`;
}

export function generateExcerpt(html: string, maxLength = 158): string {
  if (!html) return SITE_DESCRIPTION;
  const plain = html
    .replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= maxLength) return plain;
  const cut = plain.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:]+$/, "") + "...";
}
