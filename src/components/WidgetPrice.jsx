import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import WidgetChart from "./WidgetChart";

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;
const CACHE_KEY = "widget-prices-cache";

export default function WidgetPrice() {
  const [tokenPrices, setTokenPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Check if we have cached data
        const cachedData = localStorage.getItem(CACHE_KEY);
        
        if (cachedData) {
          const { timestamp, data } = JSON.parse(cachedData);
          const now = Date.now();
          
          // If the cache is still fresh (less than 5 minutes old)
          if (now - timestamp < CACHE_DURATION) {
            setTokenPrices(data);
            setLoading(false);
            console.log("Using cached price data");
            return;
          }
          // Otherwise cache is stale, continue to fetch
        }
        
        setLoading(true);
        const response = await fetch("/api/prices?selected=true");

        if (!response.ok) {
          throw new Error("Failed to fetch prices");
        }

        const data = await response.json();
        
        // Cache the fresh data with current timestamp
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            timestamp: Date.now(),
            data
          })
        );
        
        setTokenPrices(data);
        console.log("Fresh price data fetched and cached");
      } catch (error) {
        console.error("Error fetching prices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    
    // Refresh prices every minute, but actual API calls will only happen 
    // if the cache is expired (every 5 minutes)
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  // If no data is loaded yet, show a loading state
  if (loading && tokenPrices.length === 0) {
    return (
      <div className="flex flex-col gap-2 text-primary mt-5">
        <div className="relative mt-5 first:mt-0 last:mb-5">
          <div className="w-full mt-1">
            <h3 className="text-xs font-medium px-2 mb-2.5 flex items-center">
              <span className="text-white">Market</span>
              <span className="flex-grow"></span>
              <span className="text-[10px] text-muted-foreground">Live</span>
              <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500/80 animate-pulse"></span>
            </h3>
            <div className="space-y-2 px-1">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden w-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-card/80 to-card via-card/95"></div>
                  <div className="absolute inset-0 border border-primary/5 rounded-lg"></div>
                  <div className="relative flex items-center p-2.5 z-10">
                    <div className="flex-shrink-0 mr-3 relative">
                      <div className="h-9 w-9 rounded-full bg-background/80 p-0.5 shadow-sm flex items-center justify-center animate-pulse"></div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <div className="h-4 w-16 bg-background/60 rounded animate-pulse"></div>
                        <div className="h-4 w-12 bg-background/60 rounded animate-pulse"></div>
                      </div>
                      <div className="flex items-center mt-1">
                        <div className="h-3 w-24 bg-background/40 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 text-primary mt-5">
      <div className="relative mt-5 first:mt-0 last:mb-5">
        <div className="w-full mt-1">
          <h3 className="text-xs font-medium px-2 mb-2.5 flex items-center">
            <span className="text-white">Market</span>
            <span className="flex-grow"></span>
            <span className="text-[10px] text-muted-foreground">Live</span>
            <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500/80 animate-pulse"></span>
          </h3>
          <div className="space-y-2 px-1">
            {tokenPrices.map((token, index) => (
              <TooltipProvider key={token.address || index}>
                <Tooltip >
                  <TooltipTrigger className="w-full">
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden group transition-all duration-300 w-full"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-card/80 to-card via-card/95 group-hover:from-card/70 group-hover:to-card/90 transition-all"></div>
                      <div className="absolute inset-0 border border-primary/5 rounded-lg group-hover:border-primary/15 transition-colors"></div>
                      <div className="relative flex items-center p-2.5 z-10">
                        <div className="flex-shrink-0 mr-3 relative">
                          <div className="h-9 w-9 rounded-full bg-background/80 p-0.5 shadow-sm flex items-center justify-center">
                            {token.logoURI ? (
                              <img
                                className="h-full w-full object-contain rounded-full"
                                src={token.logoURI}
                                alt={token.symbol}
                              />
                            ) : (
                              <div className="h-full w-full rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                {token.symbol.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="absolute bottom-[-4px] left-[50%] translate-x-[-50%] h-[4px] w-[80%] bg-black/20 blur-sm rounded-full"></div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <p className="font-semibold text-sm tracking-tight text-white">
                                {token.symbol}
                              </p>
                            </div>
                            <p className="text-sm font-bold tracking-tight">
                              <span className="text-xs opacity-70">$</span>{" "}
                              <span>
                                {token.price
                                  ? parseFloat(token.price).toLocaleString(
                                      undefined,
                                      { maximumFractionDigits: 4 }
                                    )
                                  : "N/A"}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center">
                            <div
                              className="text-xs text-muted-foreground truncate max-w-[120px] opacity-80"
                              title={token.name}
                            >
                              {token.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={1} className="text-xs text-white bg-transparent border-black">
                    <WidgetChart tokenA={token.address} key={'widget-price'} />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
