"use client";

import { useState } from "react";

function cleanNotes(input: string): string {
  return input
    .split("\n")
    .map(line => line.trim())
    .filter(line => line !== "")
    .join("\n");
}

async function handleStream(
  res: Response,
  setScript: (updater: (prev: string) => string) => void
) {
  if (!res.body) return;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (readerDone) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data:")) continue;
      if (trimmed === "data: [DONE]") {
        done = true;
        break;
      }

      try {
        const json = JSON.parse(trimmed.replace(/^data: /, ""));
        const content = json.choices?.[0]?.delta?.content;
        if (content) {
          setScript(prev => prev + content);
        }
      } catch (err) {
        console.error("Could not parse SSE line:", trimmed, err);
      }
    }
  }
}

export default function Home() {
  const [notes, setNotes] = useState<string>("");
  const [script, setScript] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const generateScript = async () => {
    setLoading(true);
    setScript("");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: cleanNotes(notes) }), // cleaned notes
    });

    await handleStream(res, setScript);
    setLoading(false);
  };

  const copyScript = () => {
    if (script) {
      navigator.clipboard.writeText(script);
      alert("Script copied!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Turkish Lesson Script Generator
      </h1>

      <textarea
        className="w-full max-w-2xl p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-400"
        rows={6}
        placeholder="Enter your Turkish lesson notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button
        onClick={generateScript}
        disabled={loading}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Script"}
      </button>

      {script && (
        <div className="mt-8 w-full max-w-2xl">
          <div className="bg-white p-4 rounded-lg shadow-md whitespace-pre-wrap">
            {script}
          </div>
          <button
            onClick={copyScript}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
          >
            Copy Script
          </button>
        </div>
      )}
    </div>
  );
}
