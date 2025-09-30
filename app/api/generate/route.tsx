import { NextResponse } from "next/server";

export const runtime = "edge"; // optional, can also remove if you want Node runtime

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
        max_tokens: 2500,
        messages: [
          {
            role: "system",
            content:
              "You are a Turkish language teacher creating a professional and short lesson script. Do not use bullet points in the script. Write a continuous script exactly as the teacher should speak. It should be in English with examples in Turkish. Insert clear markers (Slide n: Slide Name, n being the slide number) before a new slide. After each slide, make a short list of bullet points to be added in it. The first slide should always be an overview and the bullet points to it should be the topics covered.",
          },
          {
            role: "user",
            content: `Here are the notes: ${notes}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API error: ${text}`);
    }

    const data = await response.json();
    const script = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({ script });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { error: "Failed to generate script" },
      { status: 500 }
    );
  }
}
