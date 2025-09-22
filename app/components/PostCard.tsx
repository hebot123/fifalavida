import Link from 'next/link';
import { Post } from '@/lib/posts';
import { format } from 'date-fns';

export default function PostCard({ post }: { post: Post }) {
  const { slug, metadata } = post;
  const { title, date, description, category } = metadata;
  return (
    <article className="bg-white border rounded-lg shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between">
      <div>
        <p className="text-xs uppercase text-gray-400 mb-1">{category}</p>
        <h3 className="text-lg font-semibold mb-2">
          <Link href={`/blog/${slug}`} className="hover:text-blue-600">
            {title}
          </Link>
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{description}</p>
      </div>
      <p className="text-xs text-gray-400 mt-auto">
        {format(new Date(date), 'MMMM d, yyyy')}
      </p>
    </article>
  );
}