// src/hooks/inventory/useProducts.tsx
import { useEffect, useState } from "react";
import axios from "axios";

const useProducts = () => {
  const [response, setResponse] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.post("/api/inventory/products", {
          params: { message: "I am akshat sabavat" },
        });
        setResponse(data.message);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch products");
      }
    };

    fetchData();
  }, []);

  return { response, error };
};

export default useProducts;
