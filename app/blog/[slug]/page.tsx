import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { format } from 'date-fns';

/**
 * The dynamic blog post page. When using the Next.js app router,
 * each folder under app/ that contains a [param] segment will
 * generate a dynamic route. To pre-render all blog posts at build time,
 * we export a generateStaticParams function. See:
 * https://nextjs.org/docs/app/api-reference/functions/generate-static-params
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
 * containing the slug for each post. Without this function, the
 * dynamic route will be treated as optional and the pages would
 * not be generated on a static build, leading to 404 errors on
 * deployments like Vercel.
 */
export async function generateStaticParams() {
  // Get all posts and map them to the expected param shape.
  return getAllPosts().map(({ slug }) => ({ slug }));
}

/**
 * Render an individual blog post page.
 * This component fetches the post metadata synchronously using
 * getPostBySlug and lazily loads the MDX content via dynamic
 * import. The MDX file is located in content/posts/{slug}.mdx.
 */
export default async function PostPage({ params }: Params) {
  const { slug } = params;

  // Retrieve front-matter metadata for the current slug. If the file
  // does not exist, getPostBySlug will throw an error, causing a
  // build failure instead of a silent 404 at runtime.
  const { metadata } = getPostBySlug(slug);

  // Dynamically import the compiled MDX component. This leverages
  // Next.js' built-in MDX loader to transform the .mdx file into
  // a React component. The default export is the component itself.
  const MDXContent = (await import(`@/content/posts/${slug}.mdx`)).default;

  return (
    <article className="prose lg:prose-xl mx-auto">
      <h1>{metadata.title}</h1>
      <p className="text-sm text-gray-500">
        {metadata.category} · {format(new Date(metadata.date), 'MMMM d, yyyy')}
      </p>
      <p className="italic text-gray-600">{metadata.description}</p>
      {/* Spacer before the actual content */}
      <div className="my-6" />
      {/* Render the MDX content */}
      <MDXContent />
    </article>
  );
}
