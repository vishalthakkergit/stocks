import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../supabaseConfig';
import { StockAnalysis } from '../types';

let supabase: any = null;

// Only initialize if credentials are provided
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.error("Failed to initialize Supabase client:", e);
  }
}

export const saveAnalysisToSupabase = async (analysis: StockAnalysis) => {
  if (!supabase) {
    console.warn("Supabase is not configured. Analysis will not be saved.");
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('stock_analyses')
      .insert([
        {
          ticker: analysis.ticker,
          company_name: analysis.companyName,
          total_score: analysis.totalScore,
          classification: analysis.classification,
          full_analysis: analysis, // Storing the complete JSON object for future retrieval
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      // Handle missing table error gracefully
      if (error.code === '42P01' || error.message.includes('Could not find the table')) {
         console.warn("⚠️ Supabase Table Missing: Please run the SQL creation script in your Supabase SQL Editor.");
         return null;
      }
      console.error("Supabase Insert Error:", error.message);
      return null;
    }

    console.log("Analysis successfully saved to Supabase:", data);
    return data;
  } catch (error) {
    console.error("Unexpected error saving to Supabase:", error);
    return null;
  }
};

export const getRecentAnalyses = async () => {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('stock_analyses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) {
      // Handle missing table error gracefully
      if (error.code === '42P01' || error.message.includes('Could not find the table')) {
         console.warn("⚠️ Supabase Table Missing: Recent scans cannot be fetched until the table is created.");
         return [];
      }
      console.error("Supabase Fetch Error:", error.message);
      return [];
    }

    return data.map((item: any) => item.full_analysis as StockAnalysis);
  } catch (error) {
    console.error("Unexpected error fetching from Supabase:", error);
    return [];
  }
};
