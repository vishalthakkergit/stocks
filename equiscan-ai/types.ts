export interface ScoreParameter {
  parameter: string;
  score: number;
  reason: string;
}

export interface InvestmentSummary {
  businessStrength: string;
  keyRisks: string;
  quarterlyTracking: string;
  volatilityNote: string;
}

export interface StockAnalysis {
  companyName: string;
  ticker: string;
  sector: string;
  marketCap: string;
  businessSummary: string;
  latestNews: string[];
  riskSignals: string[];
  scoreTrend: string;
  scores: ScoreParameter[];
  totalScore: number;
  classification: string;
  investmentSummary: InvestmentSummary;
  groundingUrls?: string[];
}

export interface AnalysisError {
  message: string;
}