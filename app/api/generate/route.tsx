import { NextResponse } from "next/server";

export const runtime = "edge"; // run close to user, lower latency

export async function POST(req: Request) {
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
      messages: [
        {
          role: "system",
          content:
            "You are a Turkish language teacher creating a professional and short lesson script. Do not use bullet points in the script. Write a continuous script exactly as the teacher should speak. It should be in English with examples in Turkish. Insert clear markers (Slide n: Slide Name, n being the slide number) before a new slide. After each slide, make a short list of bullet points to be added in it. The first slide should always be an overview and the bullet points to it should be the topics covered.",
        },
        { role: "user", content: `Here are the notes: ${notes}` },
      ],
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "API request failed" }, { status: 500 });
  }

  // Stream the response directly to the client
  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
