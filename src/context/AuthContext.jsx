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

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);

            const signer = provider.getSigner();
            const accountAddress = await signer.getAddress();

            setProvider(provider);
            setAccount(accountAddress);

            const contractInstance = new ethers.Contract(
                import.meta.env.VITE_CONTRACT_ADDRESS,
                contractABI,
                signer
            );
            setContract(contractInstance);
            console.log(contractInstance)
            await fetchENSName(accountAddress, provider); // ✅ Fetch ENS Name

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

    // Effect to handle wallet disconnection & reconnection
    useEffect(() => {
        if (!window.ethereum) return;

        const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
                disconnectWallet();
            } else {
                connectWallet();
            }
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('disconnect', disconnectWallet);

        connectWallet(false); // ✅ Auto-connect without notification

        return () => {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('disconnect', disconnectWallet);
        };
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
