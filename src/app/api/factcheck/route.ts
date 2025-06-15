// src/app/api/factcheck/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { statement } = await req.json();

  const genAI = new GoogleGenerativeAI("AIzaSyBSfxmVUvWZgwSRUDpUvK6jq5oh9LDgApI"!);

  try {
    // Correct model + method for Gemini v1
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a fact-checking assistant. Respond with exactly one word ("true", "false", or "uncertain") to indicate whether the following statement is factually correct:\n\n"${statement}"`;

    const result = await model.generateContent([prompt]);
    const response = result.response.text().toLowerCase().trim();

    let resultLabel: 'true' | 'false' | 'uncertain' = 'uncertain';
    if (response.includes('true')) resultLabel = 'true';
    else if (response.includes('false')) resultLabel = 'false';
    else if (response.includes('uncertain')) resultLabel = 'uncertain';

    return NextResponse.json({ result: resultLabel });
  } catch (err) {
    console.error('Gemini API error:', err);
    return NextResponse.json({ result: 'uncertain', error: 'Gemini API failed' }, { status: 503 });
  }
}
