import { NextResponse } from "next/server";

export const runtime = "nodejs";

type CoachPayload = {
  mode?: string;
  selectedCell?: { row: number; col: number } | null;
  value?: number;
  solutionValue?: number;
  candidates?: number[];
  rowValues?: number[];
  columnValues?: number[];
  blockValues?: number[];
  localMessage?: string;
};

function extractOutputText(data: unknown) {
  if (typeof data !== "object" || data === null) {
    return "";
  }

  const response = data as {
    output_text?: string;
    output?: Array<{ content?: Array<{ text?: string }> }>;
  };

  if (typeof response.output_text === "string") {
    return response.output_text.trim();
  }

  return (
    response.output
      ?.flatMap((item) => item.content ?? [])
      .map((part) => part.text)
      .filter(Boolean)
      .join("\n")
      .trim() ?? ""
  );
}

export async function POST(request: Request) {
  const payload = (await request.json()) as CoachPayload;
  const localMessage =
    typeof payload.localMessage === "string" && payload.localMessage.trim().length > 0
      ? payload.localMessage
      : "Select a cell and study the row, column and box.";
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      message: localMessage,
      source: "local",
      configured: false
    });
  }

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const cell = payload.selectedCell
    ? `R${payload.selectedCell.row + 1}C${payload.selectedCell.col + 1}`
    : "no selected cell";

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        store: false,
        max_output_tokens: 140,
        instructions:
          "You are Sensei AI Coach for a Japanese-inspired Sudoku app. Be calm, concise, and mentor-like. Explain logic from row, column, box and candidates. Do not reveal the final answer unless it is necessary to explain a mistake or a hint. Keep the answer under 65 words.",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: JSON.stringify({
                  mode: payload.mode,
                  cell,
                  currentValue: payload.value,
                  solutionValue: payload.solutionValue,
                  candidates: payload.candidates ?? [],
                  rowValues: payload.rowValues ?? [],
                  columnValues: payload.columnValues ?? [],
                  blockValues: payload.blockValues ?? [],
                  localAnalysis: localMessage
                })
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      return NextResponse.json({
        message: localMessage,
        source: "local",
        configured: true,
        error: `OpenAI request failed with ${response.status}`
      });
    }

    const data = await response.json();
    const message = extractOutputText(data);

    return NextResponse.json({
      message: message || localMessage,
      source: message ? "openai" : "local",
      configured: true
    });
  } catch (error) {
    return NextResponse.json({
      message: localMessage,
      source: "local",
      configured: true,
      error: error instanceof Error ? error.message : "OpenAI request failed"
    });
  }
}
