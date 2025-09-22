export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      {/* Logo */}
      <img
        src="assets/logo.png"
        alt="GroupSave Logo"
        className="w-24 h-24 mb-6"
      />

      {/* Titre */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        GroupSave
      </h1>
      <p className="text-gray-600 mb-8">Achetez mieux, ensemble</p>

      {/* Liens */}
      <div className="space-y-3 text-center">
        <a
          href="/signup"
          className="block px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition"
        >
          Créer un compte
        </a>
        <a
          href="/login"
          className="block px-4 py-2 rounded border border-black text-black hover:bg-gray-100 transition"
        >
          Se connecter
        </a>
        <a
          href="/account"
          className="block px-4 py-2 text-sm text-gray-600 underline"
        >
          Mon compte
        </a>
      </div>
    </main>
  );
}