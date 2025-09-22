import Hero from '@/app/components/Hero';
import UpdatesTicker from '@/app/components/UpdatesTicker';
import PostCard from '@/app/components/PostCard';
import InstagramFeed from '@/app/components/InstagramFeed';
import NewsletterCTA from '@/app/components/NewsletterCTA';
import { getAllPosts } from '@/lib/posts';

export default function HomePage() {
  // Fetch posts on the server at build time. Sorting is handled in getAllPosts.
  const posts = getAllPosts().slice(0, 3);
  return (
    <>
      <Hero />
      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Latest Updates</h2>
        <UpdatesTicker />
      </section>
      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Featured Posts</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">From Instagram</h2>
        <InstagramFeed />
      </section>
      <section className="my-12">
        <NewsletterCTA />
      </section>
    </>
  );
}