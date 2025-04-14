import { useAuth } from "../context/AuthContext";
import AddProductForm from "../components/AddProductForm";
import { useEffect } from "react";
import MyProducts from "./MyProducts";
import Products from "./Products";

const MarketPlace = () => {
    const { account, connectWallet, isLoading } = useAuth();
   
    useEffect(()=>{
        connectWallet();
    },[])

    
    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-gray-600 to-gray-800 text-white w-full min-h-72 px-6 py-10 flex flex-col items-center justify-center text-center">
                <h1 className="font-extrabold text-4xl md:text-5xl">AFO DApp Store</h1>
                <p className="text-gray-200 text-lg md:text-xl mt-3 max-w-2xl">
                    Explore a decentralized marketplace for blockchain-based applications, digital assets,
                    and Web3 innovations. Secure, fast, and transparent.
                </p>

                {!account ? (
                    <div className="mt-6">
                        <p className="text-gray-300 text-sm mb-3">
                            Get started by connecting your wallet to access the marketplace.
                        </p>
                        <button
                            className="px-6 py-3 bg-emerald-600 text-white font-semibold text-lg rounded-lg hover:bg-emerald-700 transition duration-300 flex items-center justify-center gap-3 mx-auto"
                            onClick={connectWallet}
                        >
                            {isLoading ? "Connecting..." : "Connect Wallet"}
                        </button>
                    </div>
                ) : (
                    <p className="mt-4 text-sm text-gray-300">
                        Connected as <span className="font-semibold text-white">{account}</span>
                    </p>
                )}
            </section>

            {/* Marketplace Section */}
            <main className="container mx-auto px-6 py-10">
                <AddProductForm />
                <MyProducts />
                <Products />
                

            </main>
        </div>
    );
};

export default MarketPlace;
