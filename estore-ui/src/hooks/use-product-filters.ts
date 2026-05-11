import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { type Product } from "@/data/products";
import { api } from "@/services/api";

export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const cat = searchParams.get("category") || "";
  const q = searchParams.get("q") || "";
  const [selectedBrands, setBrands] = useState<string[]>([]);
  const [price, setPrice] = useState<[number, number]>([0, 2500]);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const data = await api.products.list();
      setAllProducts(data);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    const term = (q || "").toLowerCase().trim();
    return allProducts.filter(
      (p) =>
        (!cat || p.category === cat) &&
        (selectedBrands.length === 0 || selectedBrands.includes(p.brand)) &&
        p.price >= price[0] &&
        p.price <= price[1] &&
        p.rating >= minRating &&
        (!term || p.name.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term)),
    );
  }, [allProducts, cat, selectedBrands, price, minRating, q]);

  const setCat = (v: string) => {
    setSearchParams((prev) => {
      if (v) prev.set("category", v);
      else prev.delete("category");
      return prev;
    });
  };

  return {
    filtered,
    isLoading,
    filters: {
      cat,
      setCat,
      q,
      selectedBrands,
      setBrands,
      price,
      setPrice,
      minRating,
      setMinRating,
    },
  };
}
