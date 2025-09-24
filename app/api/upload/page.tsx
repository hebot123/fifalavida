'use client';
import { useState } from "react";

export default function UploadPage() {
  const [url, setUrl] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fileInput = e.currentTarget.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;

    const body = new FormData();
    body.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body });
    const data = await res.json();
    setUrl(data.url);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload to Blob</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" name="file" accept="image/*,video/*" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>
      {url && (
        <p className="mt-4">
          File uploaded! <a href={url} target="_blank" className="text-blue-500 underline">View file</a>
        </p>
      )}
    </div>
  );
}
