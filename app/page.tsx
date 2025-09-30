"use client";

import { useState } from "react";

import Header from "./components/Header";

import Image from "next/image";
import logo from "@/app/favicon.png";

function cleanNotes(input: string): string {
  return input
    .split("\n")
    .map((line) => line.trim().replace(/\s+/g, " ")) // collapse spaces
    .filter((line) => line !== "")
    .join("\n");
}

export default function Home() {
  const [notes, setNotes] = useState<string>("");
  const [script, setScript] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const generateScript = async () => {
    setLoading(true);
    setScript("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: cleanNotes(notes) }),
      });

      const data: { script?: string; error?: string } = await res.json();

      if (data.script) {
        setScript(data.script);
      } else {
        setScript("Error generating script");
      }
    } catch (err) {
      console.error(err);
      setScript("Failed to fetch script");
    } finally {
      setLoading(false);
    }
  };

  const copyScript = () => {
    if (script) {
      navigator.clipboard.writeText(script);
      alert("Script copied!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="flex flex-col items-center p-4">
        <textarea
          className="w-full max-w-2xl p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-400"
          rows={6}
          placeholder="Enter your Turkish lesson notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button
          onClick={generateScript}
          disabled={loading || notes.length == 0}
          className="mt-4 px-6 py-2 yaleblue text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Script"}
        </button>

        <div className="mt-8 w-full max-w-2xl">
          {loading && (
            <div className="flex justify-center items-center h-64">
              <Image
                src={logo}
                alt="Loading"
                width={120}
                height={120}
                className="animate-spin"
                priority
              />
            </div>
          )}

          {!loading && script && (
            <>
              <div className="bg-white p-4 rounded-lg shadow-md whitespace-pre-wrap">
                {script}
              </div>
              <button
                onClick={copyScript}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
              >
                Copy Script
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
