import { NextResponse } from "next/server";
import { z } from "zod";
import { classifyPublicPath, isTrackablePublicPath, normalizeTrackedPath } from "@/lib/analytics";
import { createAdminClient } from "@/lib/supabase/admin";

const pageVisitSchema = z.object({
  path: z.string().trim().min(1).max(300),
  session_id: z.string().trim().min(1).max(160),
  referrer: z.string().trim().max(1000).optional().or(z.literal("")),
  metadata: z
    .object({
      title: z.string().trim().max(300).optional(),
    })
    .partial()
    .optional(),
});

function isMissingRelationError(error: { code?: string; message?: string } | null) {
  if (!error) {
    return false;
  }

  return error.code === "42P01" || error.code === "PGRST205" || error.message?.includes("does not exist") || false;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = pageVisitSchema.parse(body);
    const normalizedPath = normalizeTrackedPath(payload.path);

    if (!isTrackablePublicPath(normalizedPath)) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const classified = classifyPublicPath(normalizedPath);
    const adminClient = createAdminClient();
    const { error } = await adminClient.from("page_visits").insert([
      {
        path: classified.path,
        page_type: classified.pageType,
        page_slug: classified.pageSlug,
        session_id: payload.session_id,
        referrer: payload.referrer || null,
        metadata: payload.metadata?.title
          ? {
              title: payload.metadata.title,
            }
          : {},
      },
    ]);

    if (isMissingRelationError(error)) {
      return NextResponse.json({ success: true, skipped: true });
    }

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Page visit tracking error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
