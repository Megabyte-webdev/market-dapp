import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractABI } from '../utils/constants';
import { notify } from '../utils/notifications/Notification';
import { extractErrorMessage } from '../utils/formmaters';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [signer, setSigner] = useState(null);
    const [provider, setProvider] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const initialize = async () => {
        try {
            const newProvider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(newProvider);

            const accounts = await newProvider.send("eth_requestAccounts", []);
            const newSigner = newProvider.getSigner();
            const address = await newSigner.getAddress();

            setSigner(newSigner);
            setAccount(address);

            const newContract = new ethers.Contract(
                import.meta.env.VITE_CONTRACT_ADDRESS,
                contractABI,
                newSigner
            );
            setContract(newContract);
        } catch (error) {
            console.error("Failed to initialize wallet:", error);
            notify({
                type: "failure",
                title: "Connection Failed",
                message: extractErrorMessage(error) || "Could not connect to your wallet or wrong network."
            });
        } finally {
            setIsLoading(false);
        }
    };

    const connectWallet = async () => {
        setIsLoading(true);
        await initialize();
    };

    const disconnectWallet = () => {
        setAccount(null);
        setSigner(null);
        setContract(null);
        setProvider(null);
    };

    useEffect(() => {
        if (!window.ethereum) return;

        const handleAccountsChanged = async (accounts) => {
            if (accounts.length === 0) {
                disconnectWallet();
            } else {
                await initialize(); // Rebuild on account switch
            }
        };

        const handleChainChanged = async () => {
            await initialize(); // Rebuild everything on network switch (NO reload)
        };

        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);

        return () => {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
            window.ethereum.removeListener("chainChanged", handleChainChanged);
        };
    }, []);

    return (
        <AuthContext.Provider value={{
            account,
            contract,
            provider,
            signer,
            isLoading,
            connectWallet,
            disconnectWallet
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
