import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StockAnalysis } from "../types";

const genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    companyName: { type: Type.STRING },
    ticker: { type: Type.STRING },
    sector: { type: Type.STRING },
    marketCap: { type: Type.STRING, description: "Current market cap with currency" },
    businessSummary: { type: Type.STRING, description: "5-6 lines summary of the business model" },
    latestNews: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-4 bullet points of news from the last 60-90 days"
    },
    riskSignals: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of specific warning signals (e.g. 'CFO < PAT', 'Margin Compression'). If none, return ['No major red flags detected.']"
    },
    scoreTrend: {
      type: Type.STRING,
      description: "Interpretation of business quality trend (Improving/Stable/Declining) based on data."
    },
    scores: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          parameter: { type: Type.STRING },
          score: { type: Type.NUMBER, description: "Score from 1 to 10" },
          reason: { type: Type.STRING, description: "Simple, easy-to-understand explanation for a beginner investor (1-2 sentences)" }
        },
        required: ["parameter", "score", "reason"]
      }
    },
    totalScore: { type: Type.NUMBER },
    classification: { type: Type.STRING, description: "High-quality, Strong, Average, or Risky based on score" },
    investmentSummary: {
      type: Type.OBJECT,
      properties: {
        businessStrength: { type: Type.STRING },
        keyRisks: { type: Type.STRING },
        quarterlyTracking: { type: Type.STRING },
        volatilityNote: { type: Type.STRING }
      },
      required: ["businessStrength", "keyRisks", "quarterlyTracking", "volatilityNote"]
    }
  },
  required: [
    "companyName", "ticker", "sector", "marketCap", "businessSummary",
    "latestNews", "riskSignals", "scoreTrend", "scores", "totalScore", "classification", "investmentSummary"
  ]
};

export const analyzeStock = async (tickerOrName: string): Promise<StockAnalysis> => {
  // Using gemini-3-flash-preview for speed and efficiency with tools
  const model = "gemini-3-flash-preview";

  const prompt = `
    Analyze the company "${tickerOrName}" using the following 11-parameter investment framework.
    
    First, use Google Search to find:
    1. Latest financial data (Market Cap, Revenue, Margins, ROCE, Debt, Cash Flow vs PAT).
    2. Recent news (last 60-90 days).
    3. Business model details.

    Then, score the company (1-10) on these parameters:
    1. Growth Type (Organic/Acquisition/Cyclical)
    2. Revenue Quality (Consistency)
    3. Margin Trend (Expansion/Compression)
    4. ROCE / Capital Efficiency
    5. CFO vs PAT (Cash flow alignment)
    6. Working Capital Efficiency
    7. Balance Sheet Discipline (Debt/Stability)
    8. Capex & Operating Leverage Potential
    9. Execution Consistency (Management)
    10. Moat / Unique Business Advantage
    11. Valuation Comfort

    Total Score is the sum of all 11 scores.
    
    Classify based on Total Score:
    85+ -> High-quality business
    70-85 -> Strong business
    55-70 -> Average business
    <55 -> Risky business

    Risk Signal Check (CRITICAL):
    Check for: CFO < PAT, Revenue Stagnation, Margin Compression, Rising Debt, Customer Concentration.
    Return a list of specific "Risk Signals". If no major warnings, return ["No major red flags detected."].

    Score Trend Interpretation:
    Interpret the trajectory. Is the business improving, stable, or deteriorating? Explain in under 6 lines.

    Provide a Long-Term Investor Summary covering business strength, risks, what to track, and volatility.
    
    IMPORTANT: Write for a beginner retail investor. Use simple, clear language. Avoid overly complex jargon. 
    Explain the "why" behind the scores simply.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are a helpful investment mentor. Your goal is to educate retail investors and help them make calm, long-term decisions. Use friendly, accessible language.",
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated.");
    }

    const data = JSON.parse(text) as StockAnalysis;
    
    // Extract grounding metadata if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const urls: string[] = [];
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          urls.push(chunk.web.uri);
        }
      });
    }
    
    // Deduplicate URLs
    data.groundingUrls = Array.from(new Set(urls));

    return data;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze stock. Please try again or check the ticker.");
  }
};
