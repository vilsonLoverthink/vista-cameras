import { NextResponse } from "next/server";
import { getCameraSystemHealth, validateAllCameras } from "@/lib/camera-manager";

export async function GET() {
  try {
    const health = await getCameraSystemHealth();
    return NextResponse.json(health);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao verificar saúde do sistema", details: String(error) },
      { status: 500 }
    );
  }
}
