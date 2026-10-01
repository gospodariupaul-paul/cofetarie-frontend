import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-32">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-300/20 via-fuchsia-200/20 to-purple-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Text Content */}
          <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-gradient-to-r from-pink-50 to-fuchsia-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-pink-600 shadow-sm">
             <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-pink-500"></span>
            </span>
            <svg 
             xmlns="http://w3.org" 
             viewBox="0 0 24 24" 
             fill="currentColor" 
             className="h-4 w-4 text-pink-500 animate-spin-[spin_3s_linear_infinite]"
           >
            <path d="M9.813 15.904L9 21L14.907 17.362L20.813 21L20 15.904L24 12.108L18.533 11.621L16.453 6.362L14.373 11.621L8.907 12.108L12.907 15.904M0 3v2h5v16h2V5h5V3H0z" />
           </svg>
           Experiență Premium
        </span>

            <h1 className="mt-8 text-6xl font-extrabold leading-tight text-gray-900 lg:text-7xl">
              Deserturi care
              <span className="block text-pink-600">
                rămân în amintire
              </span>
            </h1>

            <p className="mt-8 text-xl text-gray-600">
              Torturi personalizate, candy bar și prăjituri artizanale
              create pentru momente speciale.
            </p>

            <div className="mt-10 flex gap-4">
              <button className="rounded-xl bg-pink-600 px-8 py-4 font-bold text-white shadow-xl transition hover:scale-105">
                Comandă Acum!
              </button>

              <button className="rounded-xl border border-gray-300 bg-white px-8 py-4 font-bold text-gray-700 transition hover:scale-105">
                Vezi Produsele
              </button>
            </div>

            <div className="mt-10 flex gap-10">
              <div>
                <h3 className="text-3xl font-bold text-pink-600">500+</h3>
                <p className="text-gray-500">Comenzi realizate</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-pink-600">100%</h3>
                <p className="text-gray-500">Ingrediente premium</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-pink-600">24h</h3>
                <p className="text-gray-500">Răspuns rapid</p>
              </div>
            </div>
          </div>

          {/* Image Container */}
          <div className="flex justify-center">
            <div className="relative h-[500px] w-full max-w-md overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/hero-cake.jpg"
                alt="Tort premium"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
