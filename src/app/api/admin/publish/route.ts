import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin, commitMessage } = body;

    if (pin !== "sinaps2026") {
      return NextResponse.json({ error: "Unauthorized: Invalid PIN" }, { status: 401 });
    }

    const message = commitMessage || "CMS Update from SINAPS Admin Portal";

    const cwd = process.cwd();
    await execPromise("git add .", { cwd });
    
    try {
      await execPromise(`git commit -m "${message.replace(/"/g, '\\"')}"`, { cwd });
    } catch (e: unknown) {
      const err = e as { stdout?: string };
      if (!err.stdout?.includes("nothing to commit")) {
        console.warn("Commit warning:", e);
      }
    }

    const { stdout: pushOut } = await execPromise("git push origin main", { cwd });

    return NextResponse.json({
      success: true,
      message: "Published live! Vercel is deploying your updates.",
      details: pushOut || "Push successful",
    });
  } catch (error: unknown) {
    console.error("Error publishing to GitHub:", error);
    const err = error as Error;
    return NextResponse.json({
      error: "Publish failed",
      details: err.message || String(error),
    }, { status: 500 });
  }
}
