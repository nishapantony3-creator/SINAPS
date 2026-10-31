import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import defaultContent from "@/data/siteContent.json";

export const dynamic = "force-dynamic";

const CONTENT_FILE = path.join(process.cwd(), "src", "data", "siteContent.json");

export async function GET() {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const raw = fs.readFileSync(CONTENT_FILE, "utf-8");
      return NextResponse.json({ success: true, data: JSON.parse(raw) });
    }
    return NextResponse.json({ success: true, data: defaultContent });
  } catch (error) {
    console.warn("Fallback to defaultContent:", error);
    return NextResponse.json({ success: true, data: defaultContent });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin, data } = body;

    // Verify PIN
    if (pin !== "sinaps2026") {
      return NextResponse.json({ error: "Unauthorized: Invalid PIN" }, { status: 401 });
    }

    if (!data) {
      return NextResponse.json({ error: "Missing data payload" }, { status: 400 });
    }

    // Try local file write
    try {
      fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (writeErr) {
      console.warn("Filesystem write skipped (read-only serverless):", writeErr);
    }

    // Cloud / Vercel persistence: if GITHUB_TOKEN is configured in Vercel, push commit!
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      const repo = "nishapantony3-creator/SINAPS";
      const filePath = "src/data/siteContent.json";
      const getFileUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

      let currentSha = undefined;
      try {
        const getRes = await fetch(getFileUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "SINAPS-CMS",
          },
        });
        if (getRes.ok) {
          const fileInfo = await getRes.json();
          currentSha = fileInfo.sha;
        }

        const updateRes = await fetch(getFileUrl, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "SINAPS-CMS",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `CMS Update via sinaps.in/admin: ${new Date().toLocaleString()}`,
            content: Buffer.from(JSON.stringify(data, null, 2)).toString("base64"),
            sha: currentSha,
            branch: "main",
          }),
        });

        if (updateRes.ok) {
          return NextResponse.json({
            success: true,
            message: "Saved & committed to GitHub! Vercel is auto-deploying.",
          });
        }
      } catch (ghErr) {
        console.warn("GitHub API error:", ghErr);
      }
    }

    return NextResponse.json({ success: true, message: "Content saved successfully" });
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
