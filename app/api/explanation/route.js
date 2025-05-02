import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const { quote, author, category } = await request.json();
    
    if (!quote) {
      return NextResponse.json(
        { error: "Quote text is required" },
        { status: 400 }
      );
    }
    
    const prompt = `
      Please provide a thoughtful explanation of the following quote:
      
      "${quote}" - ${author}
      
      Category: ${category}
      
      Explain the meaning, context, and significance of this quote in about 3-4 sentences.
      Your explanation should be insightful, accessible, and help the reader understand 
      the deeper meaning behind the quote.
    `;
    
    const model = ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a thoughtful philosopher and educator who helps people understand the deeper meaning behind quotes and wisdom.",
        temperature: 0.7,
      },
    });
    
    const response = await model;
    const explanation = response.text || "No explanation generated.";
    
    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("Error explaining quote:", error);
    return NextResponse.json(
      { error: "Failed to generate quote explanation" },
      { status: 500 }
    );
  }
}