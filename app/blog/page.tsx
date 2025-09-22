import { getAllPosts } from '@/lib/posts';
import PostCard from '@/app/components/PostCard';

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Blog</h1>
      <p className="text-gray-600">All our latest articles and guides on FIFA Collect, NFTs and more.</p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}