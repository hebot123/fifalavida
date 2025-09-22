import { NextResponse } from 'next/server';
import { fetchUpdates, UpdateItem } from '@/lib/updates';

// In-memory cache to avoid hitting feeds on every request. The cache is shared
// across requests in a serverless environment when possible. In a long-running
// server, this will persist for the lifetime of the process.
let cached: UpdateItem[] | null = null;
let lastFetch: number = 0;

const MAX_AGE_MS = 1000 * 60 * 60 * 4; // 4 hours

export async function GET() {
  const now = Date.now();
  if (!cached || now - lastFetch > MAX_AGE_MS) {
    cached = await fetchUpdates();
    lastFetch = now;
  }
  return NextResponse.json(cached);
}