import { getPostBySlug } from '@/lib/posts';
import { format } from 'date-fns';

interface Params {
  params: { slug: string };
}

export default async function PostPage({ params }: Params) {
  const { slug } = params;
  const { metadata } = getPostBySlug(slug);
  const MDXContent = (await import(`@content/posts/${slug}.mdx`)).default;
  return (
    <article className="prose lg:prose-xl mx-auto">
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