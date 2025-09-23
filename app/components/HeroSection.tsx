const HeroSection = () => {
  return (
    <section id="hero" className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Welcome to <span className="text-[#00FF66]">FIFA La Vida</span>
        </h1>
        <p className="text-lg md:text-2xl mb-8 text-gray-300">
          Your ultimate destination for World Cup news, scores, and collectables.
        </p>
        <div className="flex justify-center space-x-6">
          <a href="#matches" className="bg-[#00FF66] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00d956] transition-colors">See Matches</a>
          <a href="#collectables" className="border border-[#00FF66] text-[#00FF66] px-6 py-3 rounded-lg font-semibold hover:bg-[#00FF66] hover:text-black transition-colors">Start Collecting</a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
