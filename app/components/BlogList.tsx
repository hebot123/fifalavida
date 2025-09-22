import PostCard from '@/app/components/PostCard';
import { getAllPosts } from '@/lib/posts';

export default function BlogList() {
  const posts = getAllPosts();
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}