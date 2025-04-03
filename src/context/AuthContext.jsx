import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractABI } from '../utils/constants';
import { notify } from '../utils/notifications/Notification';

// Create Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [user, setUser] = useState(null); // ✅ Store ENS Name or Address
    const [isLoading, setIsLoading] = useState(false); // ✅ Loading state

    // Fetch ENS Name
    const fetchENSName = async (address, provider) => {
        try {
            const name = await provider.lookupAddress(address);
            setUser(prev => ({ ...prev, name: name || address })); // If no ENS, use address
        } catch (error) {
            setUser(prev => ({ ...prev, name: address })); // Default to address if ENS lookup fails
        }
    };

    // Connect Wallet Function
    const connectWallet = async (showNotification = true) => {
        if (isLoading) return; // Prevent multiple requests
        setIsLoading(true); // ✅ Start loading

        try {
            if (!window.ethereum) {
                notify({
                    type: "failure",
                    title: "No Wallet Found",
                    message: "Please install MetaMask or another wallet."
                });
                setIsLoading(false);
                return;
            }

            const newProvider = new ethers.providers.Web3Provider(window.ethereum);
            await newProvider.send('eth_requestAccounts', []);

            const signer = newProvider.getSigner();
            const accountAddress = await signer.getAddress();

            setProvider(newProvider);
            setAccount(accountAddress);

            const contractInstance = new ethers.Contract(
                import.meta.env.VITE_CONTRACT_ADDRESS,
                contractABI,
                signer
            );
            setContract(contractInstance);
            console.log("Contract Instance:", contractInstance);

            await fetchENSName(accountAddress, newProvider); // ✅ Fetch ENS Name

            if (showNotification) {
                notify({
                    type: "success",
                    title: "Wallet Connected",
                    message: 'Wallet connected successfully!'
                });
            }
        } catch (error) {
            console.error("Wallet connection failed", error);
            notify({
                type: "failure",
                title: "Connection Failed",
                message: error.message || "Unable to connect your wallet. Please try again."
            });
        } finally {
            setIsLoading(false); // ✅ Stop loading
        }
    };

    // Disconnect Wallet Function
    const disconnectWallet = () => {
        setAccount(null);
        setProvider(null);
        setContract(null);
        setUser(null); // ✅ Reset ENS Name
        notify({
            type: "warning",
            title: "Wallet Disconnected",
            message: "You have disconnected your wallet."
        });
    };

    // Detect Provider Changes (Accounts, Chain, or Full Provider Change)
    useEffect(() => {
        if (!window.ethereum) return;

        const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
                disconnectWallet();
            } else {
                connectWallet();
            }
        };

        const handleChainChanged = () => {
            connectWallet();
        };

        const handleProviderChanged = () => {
            console.log("Provider changed, reconnecting...");
            connectWallet();
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
        window.ethereum.on('disconnect', disconnectWallet);

        // Detect provider change if the wallet supports it
        if (window.ethereum._handleProviderChanged) {
            window.ethereum._handleProviderChanged(handleProviderChanged);
        }

        connectWallet(false); // ✅ Auto-connect without notification

        return () => {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
            window.ethereum.removeListener('disconnect', disconnectWallet);

            if (window.ethereum._handleProviderChanged) {
                window.ethereum._handleProviderChanged(null);
            }
        };
    }, []);

    // Fallback: Poll for Provider Change (Useful for WalletConnect & Other Wallets)
    useEffect(() => {
        let prevProvider = window.ethereum;

        const checkProviderChange = setInterval(() => {
            if (window.ethereum !== prevProvider) {
                console.log("Detected provider change, reconnecting...");
                prevProvider = window.ethereum;
                connectWallet();
            }
        }, 3000); // Check every 3 seconds

        return () => clearInterval(checkProviderChange);
    }, []);

    return (
        <AuthContext.Provider value={{ account, contract, provider, user, isLoading, connectWallet, disconnectWallet }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to Use Auth Context
export const useAuth = () => {
    return useContext(AuthContext);
};
