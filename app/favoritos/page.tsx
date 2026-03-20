"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cameras } from "@/lib/cameras";

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("vista-favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const removeFavorite = (id: string) => {
    const updated = favorites.filter((f) => f !== id);
    setFavorites(updated);
    localStorage.setItem("vista-favorites", JSON.stringify(updated));
  };

  const favoriteCameras = cameras.filter((c) => favorites.includes(c.id));

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors">
            ← Voltar
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center font-bold text-xs">
              V
            </div>
            <span className="text-white font-semibold">Favoritos</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">Minhas Câmeras Favoritas</h1>
        <p className="text-slate-400 mb-8">
          {favoriteCameras.length === 0
            ? "Você ainda não tem favoritos. Explore as câmeras e clique na estrela!"
            : `${favoriteCameras.length} câmera${favoriteCameras.length !== 1 ? "s" : ""} salva${favoriteCameras.length !== 1 ? "s" : ""}`}
        </p>

        {favoriteCameras.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 text-4xl mb-4">★</p>
            <p className="text-slate-400 mb-6">Nenhum favorito ainda</p>
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Explorar Câmeras
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favoriteCameras.map((camera) => (
              <div
                key={camera.id}
                className="group bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-blue-500 transition-all duration-200"
              >
                <Link href={`/camera/${camera.id}`} className="block relative aspect-video">
                  <Image
                    src={camera.thumbnail}
                    alt={camera.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    AO VIVO
                  </div>
                </Link>
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
                      onClick={() => removeFavorite(camera.id)}
                      className="text-yellow-400 hover:text-slate-400 text-lg flex-shrink-0 transition-colors"
                      aria-label="Remover favorito"
                    >
                      ★
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
