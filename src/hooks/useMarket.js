import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { notify } from '../utils/notifications/Notification';
import { ethers } from "ethers";
import { extractErrorMessage } from "../utils/formmaters";

const useMarket = () => {
    const { account, contract } = useAuth() ?? {};
    const [products, setProducts] = useState([]);
    const [myProducts, setMyProducts] = useState([]); // 👈 separate state
    const [loading, setLoading] = useState(false);
    const [addProductLoading, setAddProductLoading] = useState(false);
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const [error, setError] = useState(null);

    // ** Fetch All Products **
    const fetchProducts = async () => {
        if (!contract) return;
        setLoading(prev=>({...prev, products:true}));
        setError(null);

        try {
            const itemCount = await contract.itemCount();

            if (itemCount.toNumber() === 0) {
                setProducts([]);
                return;
            }

            const items = [];
            for (let i = 1; i <= itemCount; i++) {
                const item = await contract.items(i);
                items.push(item);
            }

            setProducts([...items].reverse());
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to fetch products.");
        } finally {
            setLoading(prev=>({...prev, products:false}));
        }
    };

    // ** Fetch My Products **
    const fetchMyProducts = async () => {
        if (!contract || !account) return;
        setLoading(prev=>({...prev, myProducts:true}));
        setError(null);

        try {
            const itemIds = await contract.getItemByOwner(account); // should return array of IDs

            const items = await Promise.all(
                itemIds.map(async (id) => {
                    const item = await contract.items(id.toNumber());
                    return item;
                })
            );

            setMyProducts([...items].filter(item=>item.name)?.reverse());
        } catch (err) {
            console.error("Error fetching your products:", err);
            setError("Failed to fetch your products.");
        } finally {
            setLoading(prev=>({...prev, myProducts:false}));
        }
    };

    // ** Add Product **
    const addProduct = async (name, price, handleSuccess) => {
        if (!contract || !account) return;

        setAddProductLoading(true);
        setError(null);

        try {
            const priceInWei = ethers.utils.parseUnits(price.toString(), "ether");
            const tx = await contract.listItems(name, priceInWei);

            await tx.wait();

            setProducts(prevProducts => [
                {
                    id: prevProducts.length,
                    name,
                    price: priceInWei,
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
                message: extractErrorMessage(err) || "Failed to add product. Please try again later."
            });
        } finally {
            setAddProductLoading(false);
        }
    };

    // ** Purchase Product **
    const purchaseProduct = async (itemId) => {
        if (!contract) return;

        setPurchaseLoading(prev=>({...prev, [itemId]:true}));
        setError(null);

        try {
            // Get the item to retrieve the price
            const item = await contract.items(itemId);

            const tx = await contract.purchaseItem(itemId, {
                value: item.price
            });
            await tx.wait();

            fetchProducts(); // Refresh product list
            fetchMyProducts(); // Refresh my products if relevant

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
                message: extractErrorMessage(err)
            });
        } finally {
            setPurchaseLoading(prev=>({...prev, [itemId]:false}));
        }
    };

    const transferOwnership = async (itemId, newOwner) => {
        if (!contract) return;

        try {
            const tx = await contract.transferItem(itemId, newOwner);
            await tx.wait();

            await fetchMyProducts(); // Refresh list
            await fetchProducts();

            notify({
                type: "success",
                title: "Ownership Transferred",
                message: `Item #${itemId} transferred successfully.`,
            });

            
        } catch (err) {
            console.error("Error transferring ownership:", err);
            notify({
                type: "failure",
                title: "Transfer Failed",
                message: extractErrorMessage(err) || "Could not transfer product. Please try again.",
            });
        }
    };


    // Auto-fetch on contract init
    useEffect(() => {
        if (contract) {
            fetchProducts();
            fetchMyProducts();
        }
    }, [contract, account]);

    return {
        products,
        myProducts, // 👈 separate export
        loading,
        error,
        addProduct,
        addProductLoading,
        purchaseProduct,
        transferOwnership,
        purchaseLoading,
        fetchProducts,
        fetchMyProducts // 👈 export function
    };
};

export default useMarket;
