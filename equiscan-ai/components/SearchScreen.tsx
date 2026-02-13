import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Clock, ChevronRight, RefreshCw, Building2 } from 'lucide-react';
import { StockAnalysis } from '../types';
import { getRecentAnalyses } from '../services/supabaseService';
import { STOCK_LIST, StockOption } from '../data/stocks';

interface Props {
  onSearch: (ticker: string) => void;
  onSelectHistory: (analysis: StockAnalysis) => void;
  isLoading: boolean;
}

const SearchScreen: React.FC<Props> = ({ onSearch, onSelectHistory, isLoading }) => {
  const [ticker, setTicker] = useState('');
  const [recentScans, setRecentScans] = useState<StockAnalysis[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  
  // Autocomplete states
  const [suggestions, setSuggestions] = useState<StockOption[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    const data = await getRecentAnalyses();
    setRecentScans(data);
    setLoadingHistory(false);
  };

  useEffect(() => {
    fetchHistory();
    
    // Click outside handler to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && 
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTicker(value);

    if (value.length > 0) {
      const filtered = STOCK_LIST.filter(stock => 
        stock.symbol.toLowerCase().includes(value.toLowerCase()) || 
        stock.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8); // Limit to 8 suggestions
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (stock: StockOption) => {
    setTicker(stock.symbol);
    setShowSuggestions(false);
    onSearch(stock.symbol);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      setShowSuggestions(false);
      onSearch(ticker.trim());
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-400";
    if (score >= 70) return "text-blue-400";
    if (score >= 55) return "text-amber-400";
    return "text-rose-400";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-fade-in w-full py-12">
      <div className="mb-8 relative">
        <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="relative bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-2xl">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
      </div>

      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight text-center">
        EquiScan AI
      </h1>
      <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed text-center">
        Professional-grade equity research assistant. 
        <br className="hidden md:block" />
        Instant 11-parameter fundamental analysis.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-lg relative group mb-12 z-20">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
        <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={ticker}
              onChange={handleInputChange}
              onFocus={() => ticker.length > 0 && setShowSuggestions(true)}
              placeholder="Enter stock symbol (e.g., AAPL, RELIANCE)"
              className="w-full h-16 pl-6 pr-16 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:bg-slate-800 focus:border-slate-600 transition-all text-lg shadow-xl uppercase"
              disabled={isLoading}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={isLoading || !ticker.trim()}
              className="absolute right-2 top-2 h-12 w-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
            {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
                <Search className="w-6 h-6" />
            )}
            </button>

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl z-50 animate-fade-in"
              >
                <ul>
                  {suggestions.map((stock) => (
                    <li 
                      key={stock.symbol}
                      onClick={() => handleSelectSuggestion(stock)}
                      className="px-6 py-3 hover:bg-slate-800 cursor-pointer flex justify-between items-center group border-b border-slate-800 last:border-0 transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">{stock.symbol}</span>
                        <span className="text-xs text-slate-500">{stock.name}</span>
                      </div>
                      <Building2 size={16} className="text-slate-600 group-hover:text-emerald-500/50" />
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </form>
      
      {/* Recent Scans Section */}
      <div className="w-full max-w-4xl animate-fade-in min-h-[100px] z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium uppercase tracking-wider">
            <Clock size={14} /> Recent Scans
          </div>
          <button 
            onClick={fetchHistory}
            disabled={loadingHistory}
            className="p-1.5 hover:bg-slate-800 rounded-md text-slate-500 hover:text-emerald-400 transition-colors disabled:opacity-50"
            title="Refresh History"
          >
            <RefreshCw size={14} className={loadingHistory ? "animate-spin" : ""} />
          </button>
        </div>
        
        {loadingHistory ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-slate-600 animate-spin" />
          </div>
        ) : recentScans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentScans.map((scan, idx) => (
              <div 
                key={idx}
                onClick={() => onSelectHistory(scan)}
                className="bg-slate-800/40 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/30 rounded-xl p-4 cursor-pointer transition-all group flex flex-col gap-2 relative overflow-hidden"
              >
                <div className="flex justify-between items-start z-10 relative">
                  <div>
                    <span className="font-bold text-white text-lg">{scan.ticker}</span>
                    <p className="text-xs text-slate-400 truncate max-w-[150px]">{scan.companyName}</p>
                  </div>
                  <div className={`font-mono font-bold text-lg ${getScoreColor(scan.totalScore)}`}>
                    {scan.totalScore}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/50 z-10 relative">
                  <span className="text-xs text-slate-500 font-medium">{scan.classification}</span>
                  <ChevronRight size={14} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
            <p className="text-slate-500 text-sm mb-4">No recent analyses found.</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['NVDA', 'MSFT', 'COST', 'JPM', 'RELIANCE'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => onSearch(sym)}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 hover:border-emerald-500/30 text-sm font-medium transition-all"
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-16 pt-8 border-t border-slate-800 w-full max-w-2xl text-center">
         <p className="text-xs text-slate-600 mb-2">Powered by Google Gemini 2.5/3.0 Models & Google Search Grounding.</p>
         <p className="text-xs text-slate-700">Disclaimer: This tool provides information for educational purposes only and does not constitute financial advice. All scores are AI-generated estimates based on available public data.</p>
      </div>
    </div>
  );
};

export default SearchScreen;
