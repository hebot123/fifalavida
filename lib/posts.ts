import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMeta{
  title: string;
  date: string;
  description: string;
  category: string;
  image?: string; // Add this line
  [key: string]: any;
}

export interface Post {
  slug: string;
  metadata: PostMeta;
}

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

/**
 * Return a list of all posts with their front‑matter metadata.
 */
export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return {
        slug,
        metadata: data as PostMeta,
      };
    })
    .sort((a, b) => (a.metadata.date < b.metadata.date ? 1 : -1));
}

/**
 * Get post by slug, returning the front‑matter and content. This is used by the blog page to render MDX.
 */
export function getPostBySlug(slug: string) {
  const fullPathMdx = path.join(postsDirectory, `${slug}.mdx`);
  const fullPathMd = path.join(postsDirectory, `${slug}.md`);
  let fullPath;
  if (fs.existsSync(fullPathMdx)) {
    fullPath = fullPathMdx;
  } else if (fs.existsSync(fullPathMd)) {
    fullPath = fullPathMd;
  } else {
    throw new Error(`Post not found: ${slug}`);
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  return { metadata: data as PostMeta, content };
}
