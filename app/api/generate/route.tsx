import { NextResponse } from "next/server";
import { sysPrompt } from "@/app/constants";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { notes } = await req.json();

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        stream: true,
        max_tokens: 2500,
        messages: [
          {
            role: "system",
            content: sysPrompt,
          },
          {
            role: "user",
            content: `Here are the notes: ${notes}`,
          },
        ],
      }),
    });

    if (!response.ok || !response.body) {
      const text = await response.text();
      throw new Error(`API error: ${text}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data:")) continue;
        if (trimmed === "data: [DONE]") break;

        try {
          const json = JSON.parse(trimmed.replace(/^data: /, ""));
          const content = json.choices?.[0]?.delta?.content;
          if (content) result += content;
        } catch (err) {
          console.error("Failed to parse line:", trimmed, err);
        }
      }
    }

    return NextResponse.json({ script: result });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Unknown error", error);
    }

    return NextResponse.json(
      { error: "Failed to generate script" },
      { status: 500 }
    );
  }
}
