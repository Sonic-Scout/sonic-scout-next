import { useState, useEffect, useRef } from "react";
import { uid } from "uid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import tokenList from "@/lib/token_list.json";

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;
const CACHE_PREFIX = "widget-chart-cache-";

// Helper function to get cache key
const getCacheKey = (tokenA, tokenB) => `${CACHE_PREFIX}${tokenA}-${tokenB}`;

// Custom tooltip component to match shadcn design
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-md shadow-md p-3">
        <p className="text-xs text-muted-foreground mb-1">
          {new Date(label).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p className="font-medium">
          <span className="text-primary">Price: </span>
          <span>${Number(payload[0].value).toFixed(6)}</span>
        </p>
      </div>
    );
  }

  return null;
};

const WidgetChart = (props) => {
  const defaultProps = {
    tokenA: "",
    tokenB: "0x0e0Ce4D450c705F8a0B6Dd9d5123e3df2787D16B",
    key: uid(16),
  };

  // Merge default props with provided props
  const mergedProps = { ...defaultProps, ...props };
  const { tokenA, tokenB, key } = mergedProps;

  // Add state for loading and token prices
  const [loading, setLoading] = useState(true);
  const [tokenPrices, setTokenPrices] = useState(null);

  // Use a ref to track fetch status and prevent duplicate fetches
  const fetchInProgress = useRef(false);
  const lastFetchParams = useRef({ tokenA: "", tokenB: "" });

  const fetchChart = async () => {
    // Skip if already fetching or if tokens are the same as last fetch
    if (
      fetchInProgress.current ||
      (lastFetchParams.current.tokenA === tokenA &&
        lastFetchParams.current.tokenB === tokenB)
    ) {
      return;
    }

    try {
      // Check if we have cached data
      const cacheKey = getCacheKey(tokenA, tokenB);
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const now = Date.now();

        // If cache is still fresh (less than 5 minutes old)
        if (now - timestamp < CACHE_DURATION) {
          console.log("Using cached chart data for", tokenA);
          setTokenPrices(data);
          setLoading(false);
          return;
        }
        // Otherwise cache is stale, continue to fetch
      }

      fetchInProgress.current = true;
      setLoading(true);

      // Update last fetch params
      lastFetchParams.current = { tokenA, tokenB };

      const response = await fetch(
        `/api/prices?chart=true&tokenA=${tokenA}&tokenB=${tokenB}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch prices");
      }

      const data = await response.json();

      // Transform the data to the format expected by the chart
      if (data.chart && Array.isArray(data.chart)) {
        const transformedData = data.chart
          .map((item) => ({
            timestamp: item.date * 1000, // Convert Unix timestamp to milliseconds
            price: item.priceUsd || item.close, // Use priceUsd or fall back to close
            high: item.high,
            low: item.low,
            open: item.open,
          }))
          // Sort by timestamp (newest first) and take only the last 10 items
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 10)
          // Reverse to show oldest to newest for better chart readability
          .reverse();

        setTokenPrices(transformedData);

        // Cache the fresh data with current timestamp
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            timestamp: Date.now(),
            data: transformedData,
          })
        );
      } else {
        // If data doesn't have the expected structure, set to empty array
        setTokenPrices([]);
      }
    } catch (error) {
      console.error("Error fetching prices:", error);
      setTokenPrices([]);
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  };

  // Use effect to fetch data when component mounts or when tokenA/tokenB changes
  useEffect(() => {
    // Only fetch if tokenA exists and there's been a change in tokens
    if (
      tokenA &&
      (tokenA !== lastFetchParams.current.tokenA ||
        tokenB !== lastFetchParams.current.tokenB)
    ) {
      fetchChart();
    }

    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenA, tokenB]); // Keep these dependencies

  // Function to find token info by address
  const getTokenInfo = (address) => {
    if (!address) return null;

    // Case insensitive comparison of addresses
    const token = tokenList.tokens.find(
      (t) => t.address.toLowerCase() === address.toLowerCase()
    );

    return token || null;
  };

  // Calculate percentage change if we have data
  const calculatePercentageChange = (prices) => {
    if (!prices || prices.length < 2) return { change: 0, hours: 0 };

    // Calculate change over the last 10 data points (matching the chart display)
    const firstPrice = prices[0].price;
    const lastPrice = prices[prices.length - 1].price;
    const percentChange = ((lastPrice - firstPrice) / firstPrice) * 100;

    // Always return a fixed value of 24 hours for consistency
    // This represents the approximate timeframe for the last 10 data points
    return {
      change: percentChange,
      hours: 24, // Fixed value for consistency across all charts
    };
  };

  // Get token info and calculate percentage change
  const tokenInfo = getTokenInfo(tokenA);
  const percentageData = tokenPrices
    ? calculatePercentageChange(tokenPrices)
    : { change: 0, hours: 24 };

  return (
    <Card key={key} className="w-full min-w-[420px]">
      <CardContent>
        {loading ? (
          <Skeleton className="w-full h-[148px] rounded-md" />
        ) : tokenPrices && tokenPrices.length > 0 ? (
          <div>
            <div className="flex items-center">
              {tokenInfo?.logoURI && <img
                className="h-8 object-contain rounded-full mr-2"
                src={tokenInfo.logoURI}
                alt={tokenInfo.symbol}
              />}
              <div className="tracking-tight text-sm font-normal">
                {tokenInfo
                  ? `${tokenInfo.name} (${tokenInfo.symbol})`
                  : "Unknown Token"}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                $
                {tokenPrices.length > 0
                  ? Number(tokenPrices[tokenPrices.length - 1].price).toFixed(6)
                  : "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">
                {percentageData.change > 0 ? "+" : ""}
                {percentageData.change.toFixed(2)}% in last{" "}
                {percentageData.hours} hours
              </p>
            </div>

            <ResponsiveContainer width={350} height={80}>
              <LineChart
                data={tokenPrices}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                  opacity={0.4}
                />
                {/* Hidden XAxis but kept for proper chart scaling */}
                <XAxis dataKey="timestamp" hide={true} />
                {/* Hidden YAxis but scaled to exactly match the data range */}
                <YAxis
                  hide={true}
                  domain={[
                    (dataMin) =>
                      Math.min(...tokenPrices.map((item) => item.price)),
                    (dataMax) =>
                      Math.max(...tokenPrices.map((item) => item.price)),
                  ]}
                  allowDataOverflow={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  position={{ x: "auto", y: "auto" }}
                  coordinate={{ x: "right", y: 0 }}
                  cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    stroke: "hsl(var(--background))",
                    strokeWidth: 1,
                    fill: "hsl(var(--primary))",
                  }}
                  activeDot={{
                    r: 6,
                    stroke: "hsl(var(--background))",
                    strokeWidth: 2,
                    fill: "hsl(var(--primary))",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex justify-center items-center text-muted-foreground">
            No price data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WidgetChart;
