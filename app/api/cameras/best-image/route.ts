import { NextResponse } from "next/server";
import { getBestImageUrl } from "@/lib/camera-manager";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cameraId = searchParams.get("id");

    if (!cameraId) {
      return NextResponse.json(
        { error: "Camera ID é obrigatório" },
        { status: 400 }
      );
    }

    const bestUrl = await getBestImageUrl(cameraId);
    return NextResponse.json({ cameraId, bestUrl });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao obter melhor URL", details: String(error) },
      { status: 500 }
    );
  }
}
