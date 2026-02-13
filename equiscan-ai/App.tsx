import React, { useState } from 'react';
import SearchScreen from './components/SearchScreen';
import AnalysisView from './components/AnalysisView';
import { StockAnalysis } from './types';
import { analyzeStock } from './services/geminiService';
import { saveAnalysisToSupabase } from './services/supabaseService';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (ticker: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeStock(ticker);
      setAnalysis(result);
      
      // Save to Supabase in the background (fire and forget)
      saveAnalysisToSupabase(result).catch(e => console.error("Save failed:", e));
      
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while analyzing the stock.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (historyItem: StockAnalysis) => {
    setAnalysis(historyItem);
    setError(null);
  };

  const handleClose = () => {
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleClose}>
             <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
             </div>
             <span className="font-bold text-lg text-white tracking-tight">EquiScan AI</span>
          </div>
          {analysis && (
            <button 
              onClick={handleClose} 
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-700"
            >
              New Analysis
            </button>
          )}
        </div>
      </header>

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto min-h-[calc(100vh-4rem)] flex flex-col">
        {error && (
          <div className="max-w-xl mx-auto mb-8 w-full p-4 bg-rose-950/30 border border-rose-500/30 rounded-xl flex items-start gap-4 text-rose-200 shadow-xl animate-fade-in">
            <div className="bg-rose-500/20 p-2 rounded-full shrink-0">
               <AlertCircle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
               <h4 className="font-semibold text-rose-100 mb-1">Analysis Failed</h4>
               <p className="text-sm opacity-90">{error}</p>
            </div>
          </div>
        )}

        {!analysis ? (
          <SearchScreen 
            onSearch={handleSearch} 
            onSelectHistory={handleSelectHistory}
            isLoading={isLoading} 
          />
        ) : (
          <AnalysisView analysis={analysis} onClose={handleClose} />
        )}
        
        {isLoading && !analysis && (
           <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center animate-fade-in">
             <div className="bg-slate-900 p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-700 flex flex-col items-center max-w-sm w-full mx-4 text-center">
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Analyzing Business</h3>
                <div className="space-y-2 text-slate-400 text-sm">
                   <p className="flex items-center justify-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                     Scanning financial data
                   </p>
                   <p className="flex items-center justify-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse delay-75"></span>
                     Reviewing market news
                   </p>
                   <p className="flex items-center justify-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse delay-150"></span>
                     Calculating quality scores
                   </p>
                </div>
             </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default App;
