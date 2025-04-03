import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { notify } from '../utils/notifications/Notification';
import { ethers } from "ethers";

const useMarket = () => {
    const { account, contract } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchProducts = async () => {
        if (!contract && !account) return;

        setLoading(true);
        setError(null);

        try {
            // Call the contract's method to fetch products
            const itemCount = await contract.itemCount(); // Replace with your contract's method
            let items=[];
            if (!isNaN(itemCount)){
              for (let i = 0; i <= itemCount; i++) {
                const item = await contract.items(i);
                items.push(item)
            }
            setProducts(items)
            console.log(items)
            }
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to fetch products.");
        } finally {
            setLoading(false);
        }
    };

    const addProduct = async (name, price) => {
        if (!contract && !account) return;

        setLoading(true);
        setError(null);

        try {
             // Convert price from Ether to Wei
        const priceInWei = ethers.utils.parseUnits(price.toString(), "ether");

            // Call the contract's method to fetch products
            const response = await contract.listItems(name, priceInWei); // Replace with your contract's method
            await response.wait()
            await fetchProducts();

            console.log(response)

            // Show success notification
            notify({
                type: "success",
                title: "Product Added",
                message: "Your product has been successfully listed on the marketplace."
            });
        } catch (err) {
            console.error("Error fetching products:", err);
            // Show error notification
            notify({
                type: "failure",
                title: "Error",
                message: "There was an issue adding the product. Please try again later."
            });
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchProducts();
    }, [contract]);


    return { products, loading, error, addProduct };
}

export default useMarket
