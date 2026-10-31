import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const MARQUEE_DIR = path.join(PUBLIC_DIR, "marquee");
const CONTENT_FILE = path.join(process.cwd(), "src", "data", "siteContent.json");

export async function GET() {
  try {
    if (!fs.existsSync(MARQUEE_DIR)) {
      fs.mkdirSync(MARQUEE_DIR, { recursive: true });
    }

    const files = fs.readdirSync(MARQUEE_DIR);
    const photos = files
      .filter((f) => /\.(jpe?g|png|webp|JPG|PNG)$/i.test(f))
      .map((f) => {
        const full = path.join(MARQUEE_DIR, f);
        const stat = fs.statSync(full);
        return {
          filename: f,
          path: `/marquee/${f}`,
          sizeMB: (stat.size / (1024 * 1024)).toFixed(2),
          modified: stat.mtime,
        };
      });

    return NextResponse.json({ success: true, photos });
  } catch (error) {
    console.error("Error listing photos:", error);
    return NextResponse.json({ error: "Failed to list photos" }, { status: 500 });
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
    const nameWithoutExt = path.parse(origName).name;
    const cleanFileName = `${Date.now()}-${nameWithoutExt}.jpg`;
    const targetPath = path.join(MARQUEE_DIR, cleanFileName);

    // Auto-compress with Sharp: Resize max 1600px width/height, 85% JPEG quality, progressive
    await sharp(buffer)
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85, progressive: true })
      .toFile(targetPath);

    const relativeUrl = `/marquee/${cleanFileName}`;

    // Auto-append to siteContent.json marquee list if exists
    if (fs.existsSync(CONTENT_FILE)) {
      try {
        const content = JSON.parse(fs.readFileSync(CONTENT_FILE, "utf-8"));
        if (Array.isArray(content.marquee)) {
          content.marquee.unshift(relativeUrl);
          fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), "utf-8");
        }
      } catch (err) {
        console.error("Failed to append to siteContent.json:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Photo uploaded and optimized successfully",
      url: relativeUrl,
      filename: cleanFileName,
    });
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 });
  }
}
