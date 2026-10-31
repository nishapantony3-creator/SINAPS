import { NextRequest, NextResponse } from "next/server";
import defaultContent from "@/data/siteContent.json";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const marqueeList = (defaultContent as unknown as { marquee?: string[] }).marquee || [];
    const photos = marqueeList.map((url: string, idx: number) => {
      const filename = url.split("/").pop() || `photo-${idx}.jpg`;
      return {
        filename,
        path: url,
        sizeMB: "0.50",
        modified: new Date().toISOString(),
      };
    });

    return NextResponse.json({ success: true, photos });
  } catch (error) {
    console.error("Error listing photos:", error);
    return NextResponse.json({ success: true, photos: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const pin = formData.get("pin");

    if (pin !== "sinaps2026") {
      return NextResponse.json({ error: "Unauthorized: Invalid PIN" }, { status: 401 });
    }

    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Clean safe filename
    const origName = file.name.replace(/[^a-zA-Z0-9_\-\.]/g, "_");
    const nameWithoutExt = origName.replace(/\.[^/.]+$/, "");
    const cleanFileName = `${Date.now()}-${nameWithoutExt}.jpg`;

    let finalBuffer = buffer;
    // Attempt Sharp optimization if installed/available
    try {
      const sharpModule = await import("sharp");
      const sharp = sharpModule.default || sharpModule;
      finalBuffer = await sharp(buffer)
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true })
        .toBuffer();
    } catch {
      // Use original buffer
    }

    // Try saving locally if filesystem is writable (local dev)
    try {
      const fs = await import("fs");
      const path = await import("path");
      const targetDir = path.join(process.cwd(), "public", "marquee");
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      fs.writeFileSync(path.join(targetDir, cleanFileName), finalBuffer);
    } catch {
      // Serverless read-only environment
    }

    const relativeUrl = `/marquee/${cleanFileName}`;

    // GitHub Sync if token is configured in Vercel environment
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      try {
        const repo = "nishapantony3-creator/SINAPS";
        const ghPath = `public/marquee/${cleanFileName}`;
        await fetch(`https://api.github.com/repos/${repo}/contents/${ghPath}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "SINAPS-CMS",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Upload photo ${cleanFileName} via admin portal`,
            content: finalBuffer.toString("base64"),
            branch: "main",
          }),
        });
      } catch (ghErr) {
        console.warn("GitHub upload error:", ghErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Photo processed successfully",
      url: relativeUrl,
      filename: cleanFileName,
    });
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 });
  }
}
