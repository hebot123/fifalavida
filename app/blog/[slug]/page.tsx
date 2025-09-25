import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { format } from 'date-fns';
import Image from 'next/image';

/**
 * The dynamic blog post page. When using the Next.js app router,
 * each folder under app/ that contains a [param] segment will
 * generate a dynamic route. To pre-render all blog posts at build time,
 * we export a generateStaticParams function.
 */
interface Params {
  /**
   * The route parameters. Next.js passes the slug extracted from
   * the URL (e.g. /blog/my-first-post) into the component via this
   * object. The key must match the dynamic segment name [slug].
   */
  params: { slug: string };
}

/**
 * Generate the list of static parameters for this route.
 * Next.js will call this function at build time to determine
 * which slugs should have a static page generated. By reading
 * all posts on the filesystem we can return an array of objects
 * containing the slug for each post.
 */
export async function generateStaticParams() {
  return getAllPosts().map(({ slug }) => ({ slug }));
}

/**
 * Render an individual blog post page.
 * This component fetches the post metadata and lazily loads the MDX content.
 */
export default async function PostPage({ params }: Params) {
  const { slug } = params;
  const { metadata } = getPostBySlug(slug);

  // Dynamically import the compiled MDX component.
  // The path alias `@/` is configured in tsconfig.json to point to the root.
  const MDXContent = (await import(`@/content/posts/${slug}.mdx`)).default;

  return (
    <article className="prose lg:prose-xl mx-auto">
      {metadata.image && (
        <Image
          src={metadata.image}
          alt={metadata.title}
          width={800}
          height={400}
          className="rounded-lg mb-8"
        />
      )}
      <h1>{metadata.title}</h1>
      <p className="text-sm text-gray-500">
        {metadata.category} · {format(new Date(metadata.date), 'MMMM d, yyyy')}
      </p>
      <p className="italic text-gray-600">{metadata.description}</p>
      <div className="my-6" />
      <MDXContent />
    </article>
  );
}
