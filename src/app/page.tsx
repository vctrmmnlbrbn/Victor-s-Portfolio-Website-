export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to My Portfolio</h1>
        <p className="text-xl text-gray-600 mb-8">
          Check out my work and get in touch!
        </p>
        <a
          href="/contact"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Contact Me
        </a>
      </div>
    </main>
  );
}
