"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cameras } from "@/lib/cameras";
import CameraImage from "@/components/CameraImage";

export default function Home() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("vista-favorites");
    if (stored) setFavorites(JSON.parse(stored));

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const toggleFavorite = (id: string) => {
    const updated = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("vista-favorites", JSON.stringify(updated));
  };

  const installApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
              V
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">VISTA</h1>
              <p className="text-xs text-slate-400">Câmeras ao Vivo</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/favoritos"
              className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>★</span>
              <span className="hidden sm:inline">Favoritos</span>
              {favorites.length > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      {/* Install Banner */}
      {showInstallBanner && (
        <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
          <p className="text-sm">Instale o VISTA no seu dispositivo para acesso rápido!</p>
          <div className="flex gap-2">
            <button
              onClick={installApp}
              className="bg-white text-blue-600 text-xs font-semibold px-3 py-1 rounded-full"
            >
              Instalar
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="text-white/70 hover:text-white text-xs"
            >
              X
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Explore o Mundo ao Vivo
        </h2>
        <p className="text-slate-400 mb-8">
          {cameras.length} câmeras públicas ao redor do globo, transmitindo agora.
        </p>

        {/* Camera Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cameras.map((camera) => (
            <div
              key={camera.id}
              className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-blue-500 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10"
            >
              {/* Thumbnail */}
              <Link href={`/camera/${camera.id}`} className="block relative aspect-video">
                <CameraImage
                  cameraId={camera.id}
                  cameraName={camera.name}
                  primaryUrl={camera.thumbnail}
                  fallbackUrls={[
                    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1280&h=720&fit=crop",
                    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1280&h=720&fit=crop",
                  ]}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  AO VIVO
                </div>
              </Link>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <Link href={`/camera/${camera.id}`}>
                      <h3 className="font-semibold text-white text-sm truncate hover:text-blue-400 transition-colors">
                        {camera.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-400 truncate">
                      {camera.location}, {camera.country}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(camera.id)}
                    className={`text-lg flex-shrink-0 transition-colors ${
                      favorites.includes(camera.id)
                        ? "text-yellow-400"
                        : "text-slate-600 hover:text-yellow-400"
                    }`}
                    aria-label="Favoritar"
                  >
                    ★
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12 py-6 text-center text-slate-500 text-sm">
        <p>VISTA — Câmeras ao Vivo do Mundo</p>
        <p className="text-xs mt-1">Transmissões ao vivo via YouTube</p>
      </footer>
    </div>
  );
}
