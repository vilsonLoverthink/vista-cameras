/**
 * Sistema Automático de Gestão de Câmeras
 * Gerencia URLs de imagens, valida, substitui quebradas e sincroniza automaticamente
 */

export interface CameraImage {
  id: string;
  primary: string;
  fallbacks: string[];
  lastValidated?: Date;
  isValid?: boolean;
}

// Banco de dados de imagens confiáveis por câmera
const CAMERA_IMAGE_DATABASE: Record<string, CameraImage> = {
  "times-square": {
    id: "times-square",
    primary: "https://img.youtube.com/vi/1EiC9bvVGnk/maxresdefault.jpg",
    fallbacks: [
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1280&h=720&fit=crop",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1280&h=720&fit=crop",
    ],
  },
  "santorini": {
    id: "santorini",
    primary: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1280&h=720&fit=crop",
    fallbacks: [
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1280&h=720&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=720&fit=crop",
    ],
  },
  "shibuya": {
    id: "shibuya",
    primary: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1280&h=720&fit=crop",
    fallbacks: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1280&h=720&fit=crop",
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1280&h=720&fit=crop",
    ],
  },
  "eiffel": {
    id: "eiffel",
    primary: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1280&h=720&fit=crop",
    fallbacks: [
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1280&h=720&fit=crop",
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1280&h=720&fit=crop",
    ],
  },
  "cristo-redentor": {
    id: "cristo-redentor",
    primary: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=720&fit=crop",
    fallbacks: [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1280&h=720&fit=crop",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1280&h=720&fit=crop",
    ],
  },
  "san-marco": {
    id: "san-marco",
    primary: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1280&h=720&fit=crop",
    fallbacks: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1280&h=720&fit=crop",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1280&h=720&fit=crop",
    ],
  },
  "big-ben": {
    id: "big-ben",
    primary: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1280&h=720&fit=crop",
    fallbacks: [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1280&h=720&fit=crop",
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1280&h=720&fit=crop",
    ],
  },
  "statue-liberty": {
    id: "statue-liberty",
    primary: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1280&h=720&fit=crop",
    fallbacks: [
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1280&h=720&fit=crop",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1280&h=720&fit=crop",
    ],
  },
  "colosseum": {
    id: "colosseum",
    primary: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=720&fit=crop",
    fallbacks: [
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1280&h=720&fit=crop",
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1280&h=720&fit=crop",
    ],
  },
  "niagara": {
    id: "niagara",
    primary: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=720&fit=crop",
    fallbacks: [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1280&h=720&fit=crop",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1280&h=720&fit=crop",
    ],
  },
};

// Cache de URLs validadas
const validationCache: Map<string, { valid: boolean; timestamp: number }> = new Map();
const CACHE_DURATION = 3600000; // 1 hora

/**
 * Valida uma URL de imagem
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  // Verificar cache
  const cached = validationCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.valid;
  }

  try {
    const response = await fetch(url, { method: "HEAD", cache: "no-store" });
    const contentType = response.headers.get("content-type") || "";
    const isValid = response.ok && contentType.includes("image");
    
    validationCache.set(url, { valid: isValid, timestamp: Date.now() });
    return isValid;
  } catch {
    validationCache.set(url, { valid: false, timestamp: Date.now() });
    return false;
  }
}

/**
 * Obtém a melhor URL disponível para uma câmera
 * Tenta primary, depois fallbacks
 */
export async function getBestImageUrl(cameraId: string): Promise<string> {
  const cameraImages = CAMERA_IMAGE_DATABASE[cameraId];
  
  if (!cameraImages) {
    return ""; // Câmera não encontrada
  }

  // Tentar primary
  if (await validateImageUrl(cameraImages.primary)) {
    return cameraImages.primary;
  }

  // Tentar fallbacks
  for (const fallback of cameraImages.fallbacks) {
    if (await validateImageUrl(fallback)) {
      return fallback;
    }
  }

  // Se nenhuma funcionar, retornar primary mesmo assim (melhor tentar que nada)
  return cameraImages.primary;
}

/**
 * Atualiza a URL de uma câmera com a melhor disponível
 */
export async function updateCameraImageUrl(cameraId: string): Promise<string> {
  return getBestImageUrl(cameraId);
}

/**
 * Valida todas as câmeras e retorna relatório
 */
export async function validateAllCameras(): Promise<Record<string, any>> {
  const results: Record<string, any> = {};

  for (const [cameraId, cameraImages] of Object.entries(CAMERA_IMAGE_DATABASE)) {
    const allUrls = [cameraImages.primary, ...cameraImages.fallbacks];
    const validUrls = [];

    for (const url of allUrls) {
      if (await validateImageUrl(url)) {
        validUrls.push(url);
      }
    }

    results[cameraId] = {
      id: cameraId,
      primary: cameraImages.primary,
      primaryValid: validUrls.includes(cameraImages.primary),
      validUrls,
      fallbacksAvailable: cameraImages.fallbacks.length,
      status: validUrls.length > 0 ? "OK" : "ERRO",
      bestUrl: validUrls[0] || cameraImages.primary,
    };
  }

  return results;
}

/**
 * Sincroniza as câmeras com as melhores URLs disponíveis
 */
export async function syncCamerasWithBestUrls(): Promise<Record<string, string>> {
  const updates: Record<string, string> = {};

  for (const cameraId of Object.keys(CAMERA_IMAGE_DATABASE)) {
    const bestUrl = await getBestImageUrl(cameraId);
    updates[cameraId] = bestUrl;
  }

  return updates;
}

/**
 * Obtém o status de saúde do sistema de câmeras
 */
export async function getCameraSystemHealth(): Promise<{
  healthy: number;
  total: number;
  percentage: number;
  status: "OK" | "WARNING" | "ERROR";
  details: Record<string, any>;
}> {
  const validation = await validateAllCameras();
  const healthy = Object.values(validation).filter((v: any) => v.status === "OK").length;
  const total = Object.keys(validation).length;
  const percentage = (healthy / total) * 100;

  let status: "OK" | "WARNING" | "ERROR" = "OK";
  if (percentage < 100) status = "WARNING";
  if (percentage < 50) status = "ERROR";

  return {
    healthy,
    total,
    percentage,
    status,
    details: validation,
  };
}
