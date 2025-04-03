import { useState } from "react";
import { notify } from "../utils/notifications/Notification"; // Assuming this is the correct path
import useMarket from "../hooks/useMarket";
import { FaSpinner } from "react-icons/fa"; // Import FaSpinner from react-icons

const AddProductForm = () => {
    const { addProduct, loading, error:isFetchError } = useMarket();
    
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!name || !price) {
            setError("Both fields are required.");
            return;
        }

        if (isNaN(price) || parseFloat(price) <= 0) {
            setError("Price must be a positive number.");
            return;
        }

        setError("");

        // Call addProduct with the entered name and price
        await addProduct(name, parseFloat(price));
        if(isFetchError == null){
        setName("");
        setPrice("");
        }
    };

    return (
        <div className="bg-gray-200 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-6 text-center">Add New Product</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-medium">
                    <div className="mb-4">
                        <label htmlFor="name" className="text-sm text-gray-700">Product Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 mt-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                            placeholder="Enter product name"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="price" className="text-sm text-gray-700">Price (ETH)</label>
                        <input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full p-3 mt-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                            placeholder="Enter product price"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading} // Disable button when loading
                    className="w-full px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition duration-300 disabled:cursor-not-allowe"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <FaSpinner className="animate-spin h-5 w-5 mr-3 text-white" />
                            Adding Product...
                        </div>
                    ) : (
                        "Add Product"
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddProductForm;
