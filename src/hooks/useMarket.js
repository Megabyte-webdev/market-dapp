import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { notify } from '../utils/notifications/Notification';
import { ethers } from "ethers";

const useMarket = () => {
    const { account, contract } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addProductLoading, setAddProductLoading] = useState(false);
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const [error, setError] = useState(null);

    // ** Fetch Products from Contract **
    const fetchProducts = async () => {
        if (!contract || !account) return;
        setLoading(true);
        setError(null);

        try {
            const itemCount = await contract.itemCount();

            // ✅ Prevent fetching when itemCount is 0
            if (itemCount.toNumber() === 0) {
                setProducts([]);
                return;
            }

            let items = [];
            for (let i = 1; i <= itemCount; i++) {
                const item = await contract.items(i);
                items.push(item);
            }

            // ✅ Reverse to show newest items first
            setProducts([...items].reverse());

            console.log([...items].reverse())
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to fetch products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [contract]);

    // ** Add Product to Marketplace **
    const addProduct = async (name, price, handleSuccess) => {
        if (!contract || !account) return;

        setAddProductLoading(true);
        setError(null);

        try {
            const priceInWei = ethers.utils.parseUnits(price.toString(), "ether");
            const tx = await contract.listItems(name, priceInWei);

            await tx.wait();  // ✅ Ensure transaction completes

            // ✅ Optimistically update UI instead of waiting for fetchProducts
            setProducts(prevProducts => [
                {
                    id: prevProducts.length,  // Temporary ID before refresh
                    name,
                    price: priceInWei,  // Stored in Wei format
                    seller: account,
                    sold: false
                },
                ...prevProducts
            ]);

            handleSuccess();
            notify({
                type: "success",
                title: "Product Added",
                message: "Your product has been successfully listed."
            });
        } catch (err) {
            console.error("Error adding product:", err);
            notify({
                type: "failure",
                title: "Error",
                message: "Failed to add product. Please try again later."
            });
        } finally {
            setAddProductLoading(false);
        }
    };


    // ** Purchase Product **
    const purchaseProduct = async (itemId) => {
        if (!contract || !account || !itemId) return;

        setPurchaseLoading(true);
        setError(null);

        try {
            const tx = await contract.purchaseItem(itemId);
            await tx.wait();

            fetchProducts();  // ✅ Refresh products after purchase

            notify({
                type: "success",
                title: "Product Purchased",
                message: "You have successfully purchased the product."
            });
        } catch (err) {
            console.error("Error purchasing product:", err);
            notify({
                type: "failure",
                title: "Error",
                message: "There was an issue purchasing the product. Please try again later."
            });
        } finally {
            setPurchaseLoading(false);
        }
    };

    return {
        products,
        loading,
        error,
        addProduct,
        addProductLoading,
        purchaseProduct,
        purchaseLoading
    };
};

export default useMarket;
