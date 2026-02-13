import React from 'react';
import { StockAnalysis, ScoreParameter } from '../types';
import { 
  TrendingUp, DollarSign, Percent, PieChart, RefreshCw, 
  Wallet, Scale, Hammer, Target, Shield, Tag, 
  Trophy, ArrowRight, Activity, AlertTriangle, 
  Newspaper, ExternalLink, CheckCircle2, AlertOctagon,
  FileText, Globe, Siren
} from 'lucide-react';

interface Props {
  analysis: StockAnalysis;
  onClose: () => void;
}

const PARAM_CONFIG: Record<string, { icon: any, label: string }> = {
  "Growth Type": { icon: TrendingUp, label: "Growth" },
  "Revenue Quality": { icon: DollarSign, label: "Revenue" },
  "Margin Trend": { icon: Percent, label: "Margins" },
  "ROCE / Capital Efficiency": { icon: PieChart, label: "Efficiency" },
  "CFO vs PAT": { icon: RefreshCw, label: "Cash Flow" },
  "Working Capital Efficiency": { icon: Wallet, label: "Operations" },
  "Balance Sheet Discipline": { icon: Scale, label: "Financial Health" },
  "Capex & Operating Leverage Potential": { icon: Hammer, label: "Scalability" },
  "Execution Consistency": { icon: Target, label: "Management" },
  "Moat / Unique Business Advantage": { icon: Shield, label: "Comp. Advantage" },
  "Valuation Comfort": { icon: Tag, label: "Valuation" },
};

const getParamConfig = (param: string) => {
  // Fuzzy match or fallback
  const key = Object.keys(PARAM_CONFIG).find(k => param.includes(k.split(' ')[0]));
  return key ? PARAM_CONFIG[key] : { icon: Activity, label: param };
};

const ScoreCard: React.FC<{ item: ScoreParameter }> = ({ item }) => {
  const { icon: Icon, label } = getParamConfig(item.parameter);
  
  let colorClass = "";
  let bgClass = "";
  let borderClass = "";

  if (item.score >= 8) {
    colorClass = "text-emerald-400";
    bgClass = "bg-emerald-500/5";
    borderClass = "border-emerald-500/20 hover:border-emerald-500/40";
  } else if (item.score >= 5) {
    colorClass = "text-amber-400";
    bgClass = "bg-amber-500/5";
    borderClass = "border-amber-500/20 hover:border-amber-500/40";
  } else {
    colorClass = "text-rose-400";
    bgClass = "bg-rose-500/5";
    borderClass = "border-rose-500/20 hover:border-rose-500/40";
  }

  return (
    <div className={`relative p-5 rounded-2xl border ${borderClass} ${bgClass} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group flex flex-col h-full`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${bgClass} ${colorClass} bg-opacity-50`}>
            <Icon size={18} />
          </div>
          <h4 className="font-semibold text-slate-200 text-sm">{label}</h4>
        </div>
        <div className={`text-xl font-bold ${colorClass}`}>
          {item.score}<span className="text-xs text-slate-500 font-normal">/10</span>
        </div>
      </div>
      
      <p className="text-sm text-slate-400 leading-relaxed flex-grow">
        {item.reason}
      </p>

      {/* Progress bar visual */}
      <div className="w-full h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
        <div 
          className={`h-full rounded-full ${colorClass.replace('text-', 'bg-')}`} 
          style={{ width: `${item.score * 10}%` }}
        />
      </div>
    </div>
  );
};

const AnalysisView: React.FC<Props> = ({ analysis, onClose }) => {
  
  const getClassificationColor = (cls: string) => {
    const lower = cls.toLowerCase();
    if (lower.includes('high')) return 'from-emerald-500 to-teal-600 shadow-emerald-900/20';
    if (lower.includes('strong')) return 'from-blue-500 to-indigo-600 shadow-blue-900/20';
    if (lower.includes('average')) return 'from-amber-500 to-orange-600 shadow-amber-900/20';
    return 'from-rose-500 to-red-600 shadow-rose-900/20';
  };

  const hasRedFlags = analysis.riskSignals.some(s => !s.toLowerCase().includes('no major red flags'));

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-20 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-baseline gap-3 mb-1">
            <h1 className="text-4xl font-bold text-white tracking-tight">{analysis.companyName}</h1>
            <span className="text-lg font-mono text-emerald-400 font-medium">{analysis.ticker}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span>{analysis.sector}</span>
            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
            <span>{analysis.marketCap}</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
        >
          Analyze Another <ArrowRight size={14} />
        </button>
      </div>

      {/* Business Summary */}
      <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Business Model</h3>
        <p className="text-slate-300 leading-relaxed">{analysis.businessSummary}</p>
      </div>

      {/* RISK SIGNAL & TREND SECTION (NEW) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Signals */}
        <div className={`rounded-xl p-5 border ${hasRedFlags ? 'bg-rose-950/10 border-rose-500/20' : 'bg-emerald-950/10 border-emerald-500/20'}`}>
          <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${hasRedFlags ? 'text-rose-400' : 'text-emerald-400'}`}>
            {hasRedFlags ? <Siren size={16} /> : <Shield size={16} />}
            Risk Radar
          </h3>
          <ul className="space-y-2">
            {analysis.riskSignals.map((signal, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${hasRedFlags ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                <span className="text-slate-200">{signal}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Score Trend Interpretation */}
        <div className="bg-slate-800/20 border border-slate-700/50 rounded-xl p-5">
           <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 text-blue-400">
            <TrendingUp size={16} />
            Trend Trajectory
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {analysis.scoreTrend}
          </p>
        </div>
      </div>

      {/* Latest News */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Newspaper size={18} className="text-slate-400" />
          Latest News
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {analysis.latestNews.map((news, idx) => (
            <li key={idx} className="relative pl-6">
              <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <p className="text-sm text-slate-300 leading-snug hover:text-slate-200 transition-colors cursor-default">
                {news}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* 12 Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Activity size={20} className="text-emerald-400" />
          Analysis Card Deck
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          
          {/* Card 1: Summary / Verdict Card */}
          <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${getClassificationColor(analysis.classification)} text-white shadow-xl flex flex-col justify-between col-span-1 md:col-span-2 lg:col-span-1 min-h-[220px]`}>
            <div>
              <div className="flex items-center gap-2 mb-2 opacity-90">
                <Trophy size={20} />
                <span className="font-bold text-sm tracking-wide uppercase">Overall Verdict</span>
              </div>
              <h3 className="text-3xl font-extrabold mb-1">{analysis.classification}</h3>
              <p className="text-white/80 text-sm font-medium">Based on 11 fundamental checks</p>
            </div>
            
            <div className="mt-6">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter">{analysis.totalScore}</span>
                <span className="text-lg opacity-70 font-medium">/ 110</span>
              </div>
              <div className="w-full bg-black/20 h-2 rounded-full mt-3">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${(analysis.totalScore / 110) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cards 2-12: Parameters */}
          {analysis.scores.map((item, idx) => (
            <ScoreCard key={idx} item={item} />
          ))}

        </div>
      </div>

      {/* Investment Thesis Section - Full Width now */}
      <div className="space-y-6 mt-8">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 md:p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FileText size={20} className="text-indigo-400" />
            Long-Term Investor Thesis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex gap-4">
              <div className="mt-1">
                 <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                   <CheckCircle2 size={16} className="text-emerald-400" />
                 </div>
              </div>
              <div>
                <h4 className="font-semibold text-emerald-100 mb-1">Business Strengths</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{analysis.investmentSummary.businessStrength}</p>
              </div>
            </div>

            <div className="flex gap-4">
               <div className="mt-1">
                 <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                   <AlertTriangle size={16} className="text-rose-400" />
                 </div>
              </div>
              <div>
                <h4 className="font-semibold text-rose-100 mb-1">Key Risks</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{analysis.investmentSummary.keyRisks}</p>
              </div>
            </div>

             <div className="flex gap-4">
               <div className="mt-1">
                 <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                   <Activity size={16} className="text-blue-400" />
                 </div>
              </div>
              <div>
                <h4 className="font-semibold text-blue-100 mb-1">Quarterly Monitor</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{analysis.investmentSummary.quarterlyTracking}</p>
              </div>
            </div>
            
             <div className="flex gap-4">
               <div className="mt-1">
                 <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                   <AlertOctagon size={16} className="text-amber-400" />
                 </div>
              </div>
              <div>
                <h4 className="font-semibold text-amber-100 mb-1">Volatility Check</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{analysis.investmentSummary.volatilityNote}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

       {/* Sources - At the bottom */}
       {analysis.groundingUrls && analysis.groundingUrls.length > 0 && (
        <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
            <Globe size={12} /> Sources
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis.groundingUrls.slice(0, 4).map((url, idx) => (
               <a 
                 key={idx} 
                 href={url} 
                 target="_blank" 
                 rel="noreferrer"
                 className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 max-w-full truncate"
               >
                 {new URL(url).hostname.replace('www.', '')} <ExternalLink size={10} />
               </a>
            ))}
          </div>
        </div>
      )}
      
    </div>
  );
};

export default AnalysisView;