import { useState, useEffect } from 'react';

export default function WidgetPrice() {
  const [tokenPrices, setTokenPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/prices?selected=true');
        
        if (!response.ok) {
          throw new Error('Failed to fetch prices');
        }
        
        const data = await response.json();
        setTokenPrices(data);
      } catch (error) {
        console.error('Error fetching prices:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrices();
    // Refresh prices every minute
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  // If no data is loaded yet, show a loading state
  if (loading && tokenPrices.length === 0) {
    return (
      <div className="bg-card p-3 rounded-lg border">
        <h3 className="text-sm font-medium mb-2">Market Prices</h3>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Loading prices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card p-3 rounded-lg border">
      <h3 className="text-sm font-medium mb-2">Market Prices</h3>
      <div className="space-y-2">
        {tokenPrices.map((token, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-500/10 h-6 w-6 flex items-center justify-center text-blue-500">
                {token.symbol.charAt(0)}
              </div>
              <span className="text-sm">{token.name}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                ${token.price ? parseFloat(token.price).toLocaleString(undefined, { maximumFractionDigits: 4 }) : 'N/A'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
