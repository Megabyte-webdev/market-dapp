import React from 'react'
import useMarket from "../hooks/useMarket";  // Import the useMarket hook
import { FaSpinner } from "react-icons/fa";
import { ethers } from "ethers";
import { useAuth } from '../context/AuthContext';

const Products = () => {
    const { account } = useAuth();
    const { products, loading, error, purchaseProduct, purchaseLoading } = useMarket();  // Use the hook to fetch products
    const handlePurchase = (id) => {
        purchaseProduct(id)
    }
    return (
        <div>
            <h3 className="text-2xl font-semibold my-6 text-center">Recently Added Products</h3>
            {loading?.products ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="bg-slate-800 rounded-lg p-4 animate-pulse h-32" />
                    ))}
                </div>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>  // Display error message if there is an error
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.length === 0 ? (
                        <div className="col-span-3 text-center bg-slate-900 rounded-lg p-6 shadow-xl">
                            <h3 className="text-lg font-semibold text-white mb-2">No Products Found</h3>
                            <p className="text-sm text-gray-400">You currently have no products. Start adding some!</p>
                        </div>
                    ) : (
                        products?.map((product) => (
                            <div key={product?.id} className="bg-slate-900 rounded-lg shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-105 p-6">
                                <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                                <p className="text-sm text-gray-400">Owner: {product.owner}</p>
                                <section className="flex justify-between gap-2  mt-4">
                                    <p className="text-lg font-semibold text-emerald-400">
                                        <span className="text-white">{ethers.utils.formatEther(product?.price)}</span> ETH
                                    </p>

                                    <div className="flex justify-between items-center">
                                        {/* Hide Buy button if product owner is the same as connected account */}
                                        {product.owner !== account ? (
                                            <button
                                                disabled={purchaseLoading[product?.id]}
                                                onClick={() => handlePurchase(product.id)}
                                                className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition duration-300 disabled:cursor-not-allowed disabled:opacity-70">

                                                {purchaseLoading[product?.id] ? (
                                                    <div className="flex items-center justify-center">
                                                        <FaSpinner className="animate-spin h-5 w-5 mr-3 text-white" />
                                                        Purchasing...
                                                    </div>
                                                ) : (
                                                    "Buy Now"
                                                )}
                                            </button>
                                        ) : (
                                            <span className="text-green-500 text-sm font-semibold">Owned by you</span>
                                        )}
                                    </div>
                                </section>
                            </div>
                        ))
                    )}
                </div>

            )}
        </div>
    )
}

export default Products