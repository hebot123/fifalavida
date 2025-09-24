import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file") as File;

  // "public" means it will get a shareable CDN URL
  const { url } = await put(file.name, file, { access: "public" });

  return NextResponse.json({ url });
}
