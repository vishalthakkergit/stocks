export interface StockOption {
  symbol: string;
  name: string;
}

export const STOCK_LIST: StockOption[] = [
  // US Tech Giants
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'AVGO', name: 'Broadcom Inc.' },
  { symbol: 'ORCL', name: 'Oracle Corporation' },
  { symbol: 'CRM', name: 'Salesforce Inc.' },
  { symbol: 'AMD', name: 'Advanced Micro Devices' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
  { symbol: 'INTC', name: 'Intel Corporation' },
  { symbol: 'IBM', name: 'International Business Machines' },
  { symbol: 'UBER', name: 'Uber Technologies' },
  { symbol: 'ABNB', name: 'Airbnb Inc.' },
  { symbol: 'PLTR', name: 'Palantir Technologies' },
  { symbol: 'COIN', name: 'Coinbase Global' },

  // US Finance & Economy
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
  { symbol: 'BAC', name: 'Bank of America Corp' },
  { symbol: 'V', name: 'Visa Inc.' },
  { symbol: 'MA', name: 'Mastercard Inc.' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway' },
  { symbol: 'GS', name: 'Goldman Sachs' },
  { symbol: 'MS', name: 'Morgan Stanley' },
  { symbol: 'BLK', name: 'BlackRock Inc.' },

  // Consumer & Retail
  { symbol: 'WMT', name: 'Walmart Inc.' },
  { symbol: 'COST', name: 'Costco Wholesale' },
  { symbol: 'PG', name: 'Procter & Gamble' },
  { symbol: 'KO', name: 'Coca-Cola Company' },
  { symbol: 'PEP', name: 'PepsiCo Inc.' },
  { symbol: 'MCD', name: 'McDonald\'s Corp' },
  { symbol: 'NKE', name: 'Nike Inc.' },
  { symbol: 'DIS', name: 'Walt Disney Company' },
  { symbol: 'SBUX', name: 'Starbucks Corp' },
  { symbol: 'TGT', name: 'Target Corporation' },

  // Healthcare
  { symbol: 'JNJ', name: 'Johnson & Johnson' },
  { symbol: 'LLY', name: 'Eli Lilly and Company' },
  { symbol: 'UNH', name: 'UnitedHealth Group' },
  { symbol: 'PFE', name: 'Pfizer Inc.' },
  { symbol: 'MRK', name: 'Merck & Co.' },

  // India (NSE/BSE Top Listings)
  { symbol: 'RELIANCE', name: 'Reliance Industries' },
  { symbol: 'TCS', name: 'Tata Consultancy Services' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank' },
  { symbol: 'INFY', name: 'Infosys Ltd' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel' },
  { symbol: 'SBIN', name: 'State Bank of India' },
  { symbol: 'ITC', name: 'ITC Limited' },
  { symbol: 'LICI', name: 'LIC India' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever' },
  { symbol: 'LT', name: 'Larsen & Toubro' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints' },
  { symbol: 'AXISBANK', name: 'Axis Bank' },
  { symbol: 'TITAN', name: 'Titan Company' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharma' },
  { symbol: 'ZOMATO', name: 'Zomato Ltd' },
  { symbol: 'PAYTM', name: 'Paytm (One97)' },

  // Global / Others
  { symbol: 'TSM', name: 'Taiwan Semiconductor' },
  { symbol: 'ASML', name: 'ASML Holding' },
  { symbol: 'BABA', name: 'Alibaba Group' },
  { symbol: 'TM', name: 'Toyota Motor Corp' },
  { symbol: 'SONY', name: 'Sony Group' },
  { symbol: 'SHEL', name: 'Shell plc' },
  { symbol: 'AZN', name: 'AstraZeneca' },
  { symbol: 'SAP', name: 'SAP SE' },
  { symbol: 'SHOP', name: 'Shopify Inc.' },
  { symbol: 'SPOT', name: 'Spotify Technology' },
];
