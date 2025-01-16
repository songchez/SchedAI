import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/googleClient";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code missing" },
      { status: 400 }
    );
  }

  try {
    const tokens = await getAccessToken(code);

    // Access Token과 Refresh Token 저장 로직
    console.log("Access Token:", tokens.access_token);
    console.log("Refresh Token:", tokens.refresh_token);

    return NextResponse.json({ success: true, tokens });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching tokens:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
