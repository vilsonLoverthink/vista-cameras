"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface CameraImageProps {
  cameraId: string;
  cameraName: string;
  primaryUrl: string;
  fallbackUrls?: string[];
  className?: string;
}

export default function CameraImage({
  cameraId,
  cameraName,
  primaryUrl,
  fallbackUrls = [],
  className = "",
}: CameraImageProps) {
  const [imageUrl, setImageUrl] = useState(primaryUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Tentar obter a melhor URL do servidor
    const fetchBestImage = async () => {
      try {
        const response = await fetch(`/api/cameras/best-image?id=${cameraId}`);
        if (response.ok) {
          const data = await response.json();
          setImageUrl(data.bestUrl);
        }
      } catch (err) {
        console.error("Erro ao buscar melhor imagem:", err);
        // Manter a URL primária
      }
    };

    fetchBestImage();
  }, [cameraId]);

  const allUrls = [imageUrl, ...fallbackUrls];
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);

  const handleImageError = () => {
    if (currentUrlIndex < allUrls.length - 1) {
      setCurrentUrlIndex(currentUrlIndex + 1);
    } else {
      setError(true);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (error) {
    return (
      <div className={`${className} bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-slate-400 text-sm">Imagem indisponível</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center z-10">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      )}
      <Image
        src={allUrls[currentUrlIndex]}
        alt={cameraName}
        fill
        className={`${className} object-cover`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        unoptimized
        priority={false}
      />
    </div>
  );
}
