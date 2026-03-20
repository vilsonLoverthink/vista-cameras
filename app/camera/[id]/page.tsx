"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { cameras } from "@/lib/cameras";
import { notFound } from "next/navigation";

interface ChatMessage {
  id: number;
  user: string;
  text: string;
  time: string;
}

const FAKE_USERS = ["Ana", "Carlos", "Maria", "Pedro", "Lucia", "João", "Sofia", "Rafael"];
const FAKE_MESSAGES = [
  "Que vista incrível!",
  "Adoro essa câmera!",
  "Está chovendo aí?",
  "Já visitei esse lugar!",
  "Sonho ir um dia!",
  "Muito bonito!",
  "Que movimento!",
  "Olha o pôr do sol!",
  "Impressionante!",
  "Quero morar aí!",
];

export default function CameraPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const camera = cameras.find((c) => c.id === id);

  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [msgCounter, setMsgCounter] = useState(100);

  useEffect(() => {
    if (!camera) return;

    // Load favorites
    const stored = localStorage.getItem("vista-favorites");
    if (stored) {
      const favs = JSON.parse(stored);
      setIsFavorite(favs.includes(camera.id));
    }

    // Load user rating
    const storedRating = localStorage.getItem(`vista-rating-${camera.id}`);
    if (storedRating) setUserRating(parseInt(storedRating));

    // Generate random average rating
    setRating(3.5 + Math.random() * 1.5);

    // Seed initial chat messages
    const initial: ChatMessage[] = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      user: FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)],
      text: FAKE_MESSAGES[Math.floor(Math.random() * FAKE_MESSAGES.length)],
      time: new Date(Date.now() - (5 - i) * 60000).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
    setChatMessages(initial);

    // Auto-generate messages
    const interval = setInterval(() => {
      setChatMessages((prev) => {
        const newMsg: ChatMessage = {
          id: Date.now(),
          user: FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)],
          text: FAKE_MESSAGES[Math.floor(Math.random() * FAKE_MESSAGES.length)],
          time: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        return [...prev.slice(-19), newMsg];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [camera]);

  if (!camera) notFound();

  const toggleFavorite = () => {
    const stored = localStorage.getItem("vista-favorites");
    const favs: string[] = stored ? JSON.parse(stored) : [];
    const updated = isFavorite
      ? favs.filter((f) => f !== camera.id)
      : [...favs, camera.id];
    localStorage.setItem("vista-favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  const handleRate = (stars: number) => {
    setUserRating(stars);
    localStorage.setItem(`vista-rating-${camera.id}`, stars.toString());
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMsgCounter((c) => c + 1);
    setChatMessages((prev) => [
      ...prev.slice(-19),
      {
        id: msgCounter,
        user: "Você",
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setChatInput("");
  };

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
            <span className="text-white font-semibold">{camera.name}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Player + Info */}
          <div className="lg:col-span-2 space-y-4">
            {/* Player */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
              <iframe
                src={camera.embedUrl}
                title={camera.name}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Info */}
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-white">{camera.name}</h1>
                  <p className="text-slate-400 text-sm">
                    {camera.location}, {camera.country}
                  </p>
                  <p className="text-slate-300 text-sm mt-2">{camera.description}</p>
                </div>
                <button
                  onClick={toggleFavorite}
                  className={`text-2xl flex-shrink-0 transition-colors ${
                    isFavorite ? "text-yellow-400" : "text-slate-600 hover:text-yellow-400"
                  }`}
                  aria-label="Favoritar"
                >
                  ★
                </button>
              </div>

              {/* Rating */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <p className="text-sm text-slate-400 mb-2">
                  Avaliação média:{" "}
                  <span className="text-yellow-400 font-semibold">
                    {rating.toFixed(1)} ★
                  </span>
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-slate-400 mr-2">Sua avaliação:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRate(star)}
                      className={`text-xl transition-colors ${
                        star <= userRating
                          ? "text-yellow-400"
                          : "text-slate-600 hover:text-yellow-400"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  {userRating > 0 && (
                    <span className="text-xs text-slate-400 ml-2">
                      Você avaliou com {userRating} estrela{userRating !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Other cameras */}
            <div>
              <h2 className="text-white font-semibold mb-3">Outras câmeras</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cameras
                  .filter((c) => c.id !== camera.id)
                  .slice(0, 3)
                  .map((c) => (
                    <Link
                      key={c.id}
                      href={`/camera/${c.id}`}
                      className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800 hover:border-blue-500 transition-colors"
                    >
                      <div className="relative aspect-video">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.thumbnail}
                          alt={c.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-white p-2 truncate">{c.name}</p>
                    </Link>
                  ))}
              </div>
            </div>
          </div>

          {/* Right: Chat */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col h-[500px] lg:h-auto lg:max-h-[700px]">
            <div className="p-3 border-b border-slate-800">
              <h2 className="text-white font-semibold text-sm">Chat ao Vivo</h2>
              <p className="text-xs text-slate-400">Converse com outros espectadores</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="text-sm">
                  <span
                    className={`font-semibold ${
                      msg.user === "Você" ? "text-blue-400" : "text-slate-300"
                    }`}
                  >
                    {msg.user}
                  </span>
                  <span className="text-slate-500 text-xs ml-1">{msg.time}</span>
                  <p className="text-slate-300 text-xs mt-0.5">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Escreva uma mensagem..."
                className="flex-1 bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500 placeholder-slate-500"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-lg transition-colors"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
