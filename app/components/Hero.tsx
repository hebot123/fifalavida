// app/components/Hero.tsx

export default function Hero() {
  return (
    <section
      className="py-12 text-center bg-cover bg-center bg-no-repeat text-white rounded-lg"
      style={{ backgroundImage: "url('/hero-background.jpg')" }}
    >
      <div className="max-w-3xl mx-auto px-4 bg-black bg-opacity-50 rounded-lg py-8">
        <h1 className="text-4xl font-extrabold mb-4">FIFA La Vida</h1>
        <p className="mb-6 text-lg">
          Your one‑stop hub for FIFA moments, NFTs and fan guides. Discover, collect and stay in the know.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="https://collect.fifa.com/?referrer=fifalavida"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100"
          >
            Start Collecting
          </a>
          <a
            href="/blog"
            className="border border-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-blue-600"
          >
            Read the Guides
          </a>
        </div>
      </div>
    </section>
  );
}
