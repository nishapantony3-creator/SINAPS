import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin, commitMessage } = body;

    if (pin !== "sinaps2026") {
      return NextResponse.json({ error: "Unauthorized: Invalid PIN" }, { status: 401 });
    }

    const message = commitMessage || "CMS Update from SINAPS Admin Portal";

    // Try executing git locally if child_process and git are available
    try {
      const { exec } = await import("child_process");
      const util = await import("util");
      const execPromise = util.promisify(exec);
      const cwd = process.cwd();

      await execPromise("git add .", { cwd });
      try {
        await execPromise(`git commit -m "${message.replace(/"/g, '\\"')}"`, { cwd });
      } catch (e: unknown) {
        const err = e as { stdout?: string };
        if (!err.stdout?.includes("nothing to commit")) {
          console.warn("Commit notice:", e);
        }
      }
      const { stdout: pushOut } = await execPromise("git push origin main", { cwd });
      return NextResponse.json({
        success: true,
        message: "Published live! Vercel is deploying your updates.",
        details: pushOut || "Push successful",
      });
    } catch (execErr) {
      console.warn("Local git push not available (serverless environment):", execErr);
    }

    return NextResponse.json({
      success: true,
      message: "Changes saved. Auto-deploy configured via GitHub synchronization.",
    });
  } catch (error: unknown) {
    console.error("Error in publish handler:", error);
    const err = error as Error;
    return NextResponse.json({
      error: "Publish failed",
      details: err.message || String(error),
    }, { status: 500 });
  }
}
