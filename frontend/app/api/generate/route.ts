import { GoogleGenerativeAI } from "@google/generative-ai";
import { VIRAL_PATTERNS, SYSTEM_INSTRUCTION } from "@/app/lib/viralContext";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key missing. Check server logs." },
        { status: 500 }
      );
    }

    const { category, userPrompt } = await req.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // ============================================================
    // BAGIAN PENTING: PILIH MODEL
    // ============================================================
    // Opsi 1 (Cepat & Murah): "gemini-1.5-flash"
    // Opsi 2 (Stabil): "gemini-pro"
    // Jika flash masih error 404, GANTI string di bawah jadi "gemini-pro"
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro" 
    });

    const finalPrompt = `
      ${SYSTEM_INSTRUCTION}
      ${VIRAL_PATTERNS}
      
      TOPIC: ${category || "General"}
      USER REQUEST: "${userPrompt}"
      
      Output WAJIB JSON Array murni.
    `;

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    let text = response.text();

    // Bersihkan JSON
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Hapus karakter aneh brackets
    const firstBracket = text.indexOf('[');
    const lastBracket = text.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1) {
      text = text.substring(firstBracket, lastBracket + 1);
    }
    
    const hooks = JSON.parse(text);
    return NextResponse.json({ hooks });

  } catch (error: any) {
    console.error("❌ GOOGLE AI ERROR:", error); 
    
    // Pesan Error Spesifik untuk Frontend
    let errorMessage = "Internal Server Error";
    
    if (error.message.includes("404") || error.message.includes("not found")) {
       errorMessage = "Model AI tidak ditemukan. Coba ganti ke 'gemini-pro' di route.ts";
    } else if (error.message.includes("API key")) {
       errorMessage = "API Key bermasalah.";
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}