import { NextResponse } from "next/server";
import { buildGoogleMapsEmbedUrl } from "@/lib/google-maps";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceUrl = searchParams.get("url") ?? "";
    const embedUrl = await buildGoogleMapsEmbedUrl(sourceUrl);

    return NextResponse.json({ embedUrl });
  } catch (error) {
    console.error("Maps embed URL generation error:", error);
    return NextResponse.json({ embedUrl: "" });
  }
}
