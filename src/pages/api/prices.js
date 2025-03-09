import token_list from '@/lib/token_list.json';

export default async function handler(req, res) {
  const { method, query } = req;


  if (method === 'GET') {
    // Check if we're requesting chart data
    if (query.chart && query.tokenA) {
      const chartData = await get_price_chart(query.tokenA);
      return res.status(200).json(chartData);
    }
    // Check if we're requesting specific addresses or selected preset tokens
    else if (query.addresses) {
      const addresses = query.addresses.split(',');
      const prices = await get_prices(addresses);
      return res.status(200).json(prices);
    } else if (query.selected === 'true') {
      const selectedPrices = await get_selected_price();
      return res.status(200).json(selectedPrices);
    }
    
    // Default: return empty response
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  
  // Handle unsupported methods
  return res.status(405).json({ error: 'Method not allowed' });
}

async function get_prices(address = []) {
  try {
    // Format addresses to match the API's expected format: sonic:ADDRESS
    const formattedAddresses = address.map(addr => `sonic:${addr}`).join(',');
    
    // Construct the API URL
    const apiUrl = `https://api.wagmi.com/prices/current/${formattedAddresses}`;
    
    // Fetch data from the API with a cache policy of 5 minutes
    const response = await fetch(apiUrl, { next: { revalidate: 300 } });
    
    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    
    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return { coins: {} }; // Return empty object on error
  }
}

async function get_selected_price() {
  const { tokens } = token_list;

  // Addresses of selected tokens
  const address = [
    "0x0e0Ce4D450c705F8a0B6Dd9d5123e3df2787D16B",
    "0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38",
    "0x50c42dEAcD8Fc9773493ED674b675bE577f2634b",
    "0x50c42dEAcD8Fc9773493ED674b675bE577f2634b",
    // "0x068e9e009fDa970fA953E1f6a43D982cA991F4bA",
    "0x851feE47C6588506277c439A7526aE58cD1d15e5", // ODIN
  ];
  
  const selected_tokens = tokens.filter(token => address.includes(token.address));
  const addresses = selected_tokens.map(token => token.address);
  
  const { coins } = await get_prices(addresses);
  
  let temp = [];

  // Match tokens with their prices
  for (const [key, value] of Object.entries(coins)) {
    selected_tokens.forEach(token => {
      if (token.symbol === value.symbol) {
        temp.push({
          ...token,
          price: value.price
        });
      }
    });
  }
  
  return temp;
}

/**
 * Fetches price chart data comparing two tokens
 * @param {string} tokenA - Address of the first token
 * @param {string} tokenB - Address of the second token
 * @param {string} unit - Time unit for chart data (h, d, w, m, y)
 * @returns {Object} Chart data for the token pair
 */
async function get_price_chart(tokenA, tokenB='0x29219dd400f2Bf60E5a23d13Be72B486D4038894', unit = 'h') {
  try {
    // Chain ID 146 appears to be used (from the example URL)
    const chainId = 146;
    
    // Construct the API URL
    const apiUrl = `https://api.wagmi.com/prices/chart/${chainId}/${tokenA}/${tokenB}?unit=${unit}`;
    
    // Fetch data from the API with a cache policy
    const response = await fetch(apiUrl, { next: { revalidate: 300 } });  // Cache for 5 minutes
    
    // Check if the response is successful
    if (!response.ok) {
      console.log(response);
      throw new Error(`Price chart API call failed with status: ${response.status}`);
    }
    
    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error('Error fetching price chart data:', error);
    return { chart: [], error: 'Failed to fetch chart data' };
  }
}


