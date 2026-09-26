import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";

const SITE_URL = "https://blog.wabog.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const tags = getAllTags();
  const latestUpdate = posts[0]?.updatedAt ?? posts[0]?.date;

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: latestUpdate ? new Date(latestUpdate) : undefined,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/articulos/`,
      lastModified: latestUpdate ? new Date(latestUpdate) : undefined,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...tags.map((tag) => ({
      url: `${SITE_URL}/tag/${tag.slug}/`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/${post.slug}/`,
      lastModified: new Date(post.updatedAt ?? post.date),
      images: post.coverImage
        ? [new URL(post.coverImage, SITE_URL).toString()]
        : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
