'use client';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { configDotenv } from 'dotenv';
import { sonic } from 'wagmi/chains';

// Load environment variables
configDotenv();

// Get project ID from environment variable or use a fallback
const projectId = process.env.REOWN_PROJECTID || 'YOUR_PROJECT_ID';

const rainbowkitConfig = getDefaultConfig({
  appName: 'Sonic Scout',
  projectId,
  chains: [sonic],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export default rainbowkitConfig;