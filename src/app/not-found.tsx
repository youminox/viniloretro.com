import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center bg-light-bg py-24 px-4">
        <div className="max-w-lg text-center space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-900 text-amber-400">
            <span className="text-2xl font-extrabold">404</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900">
            Página no encontrada
          </h1>
          <p className="text-sm sm:text-base text-stone-600">
            Parece que el disco o artículo que buscabas ha cambiado de surco.
            Explora nuestras secciones principales o utiliza el buscador:
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-dark transition"
            >
              Ir al Inicio
            </Link>
            <Link
              href="/resenas/"
              className="rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-bold text-stone-800 hover:border-primary transition"
            >
              Reseñas de Tocadiscos
            </Link>
            <Link
              href="/curiosidades/"
              className="rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-bold text-stone-800 hover:border-primary transition"
            >
              Guías y Agujas
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
