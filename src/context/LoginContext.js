"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAccount } from "wagmi";

// Create the context
const LoginContext = createContext({});

export function LoginProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use Wagmi's useAccount hook to get wallet connection information
  const { address, isConnected, isConnecting, status } = useAccount();

  // Handle wallet connection state changes
  useEffect(() => {
    console.log(`Wallet connection state changed: ${status}, address: ${address}, isConnected: ${isConnected}`);
    
    if (isConnected && address) {
      // Handle wallet connection
      const walletUser = {
        id: address,
        address: address,
        type: 'wallet',
        name: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
      };
      setUser(walletUser);
      localStorage.setItem('user', JSON.stringify(walletUser));
    } else if (!isConnected) {
      // Handle wallet disconnection - only clear wallet-based users
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.type === 'wallet') {
            setUser(null);
            localStorage.removeItem('user');
          }
        } catch (e) {
          console.error("Error parsing stored user:", e);
        }
      }
    }
  }, [isConnected, address, status]);

  // Function to handle login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Implement your login logic here
      // This is a placeholder - replace with actual authentication logic
      const response = await fakeAuthService(email, password);
      
      if (response.success) {
        const emailUser = {
          ...response.user,
          type: 'email'
        };
        setUser(emailUser);
        localStorage.setItem('user', JSON.stringify(emailUser));
        return true;
      } else {
        setError(response.error || 'Login failed');
        return false;
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to handle logout
  const logout = () => {
    // Only clear email-based users
    // Wallet-connected users should disconnect via wallet
    if (user && user.type === 'email') {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  // Check if user is already logged in on mount
  useEffect(() => {
    console.log("Checking for stored user with isConnected:", isConnected);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // If we have a wallet user but no active wallet connection,
        // don't restore the user
        if (parsedUser.type === 'wallet' && !isConnected) {
          console.log("Found wallet user but wallet is not connected, removing");
          localStorage.removeItem('user');
        } else {
          console.log("Restoring user:", parsedUser.type);
          setUser(parsedUser);
        }
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, [isConnected]);

  // Mock authentication service - replace with real implementation
  const fakeAuthService = async (email, password) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email && password) {
      return {
        success: true,
        user: { id: '123', name: 'User', email }
      };
    }
    
    return {
      success: false,
      error: 'Invalid credentials'
    };
  };

  // Include wallet connection state in the context
  const contextValue = {
    user,
    loading: loading || isConnecting,
    error,
    login,
    logout,
    isWalletConnected: isConnected,
    walletAddress: address,
    connectionStatus: status
  };

  return (
    <LoginContext.Provider value={contextValue}>
      {children}
    </LoginContext.Provider>
  );
}

// Custom hook to use the login context
export const useLogin = () => {
  const context = useContext(LoginContext);
  if (context === undefined) {
    throw new Error('useLogin must be used within a LoginProvider');
  }
  return context;
};
