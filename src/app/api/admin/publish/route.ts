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

    // Run git commands in the project directory
    const cwd = process.cwd();
    await execPromise("git add .", { cwd });
    
    // Check if there are changes to commit
    try {
      await execPromise(`git commit -m "${message.replace(/"/g, '\\"')}"`, { cwd });
    } catch (e: any) {
      // If nothing to commit, we can still proceed to push
      if (!e.stdout?.includes("nothing to commit")) {
        console.warn("Commit warning:", e);
      }
    }

    // Push to GitHub main branch
    const { stdout: pushOut } = await execPromise("git push origin main", { cwd });

    return NextResponse.json({
      success: true,
      message: "Published live! Vercel is deploying your updates.",
      details: pushOut || "Push successful",
    });
  } catch (error: any) {
    console.error("Error publishing to GitHub:", error);
    return NextResponse.json({
      error: "Publish failed",
      details: error.message || String(error),
    }, { status: 500 });
  }
}
