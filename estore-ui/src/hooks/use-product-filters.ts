import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { type Product } from "@/types";
import { api } from "@/services/api";

function getFilterKey(params: URLSearchParams): string {
  const keys = ["category", "q", "minDiscount", "brands", "minPrice", "maxPrice", "minRating"];
  return keys.map((k) => params.get(k) || "").join("|");
}

export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageRef = useRef(1);
  const loadPageRef = useRef<(...args: Parameters<typeof loadPage>) => void>(() => {});
  const filterKeyRef = useRef(getFilterKey(searchParams));

  const cat = searchParams.get("category") || "";
  const q = searchParams.get("q") || "";
  const minDiscount = searchParams.get("minDiscount") || "";
  const brands = searchParams.get("brands") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const minRating = searchParams.get("minRating") || "";

  const currentFilterKey = getFilterKey(searchParams);

  const loadPage = useCallback(
    async (pageNum: number, append: boolean) => {
      if (append) setLoadingMore(true);
      else setIsLoading(true);
      setError(null);
      try {
        const result = await api.products.list({
          page: pageNum,
          limit: 10,
          category: cat || undefined,
          q: q || undefined,
          minDiscount: minDiscount ? Number(minDiscount) : undefined,
          brands: brands || undefined,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice && maxPrice !== "2500" ? Number(maxPrice) : undefined,
          minRating: minRating ? Number(minRating) : undefined,
        });
        if (append) {
          setProducts((prev) => [...prev, ...result.data]);
        } else {
          setProducts(result.data);
        }
        setHasMore(pageNum < result.totalPages);
      } catch {
        setError("Impossible de charger les produits");
      } finally {
        setIsLoading(false);
        setLoadingMore(false);
      }
    },
    [cat, q, minDiscount, brands, minPrice, maxPrice, minRating],
  );

  loadPageRef.current = loadPage;

  useEffect(() => {
    filterKeyRef.current = currentFilterKey;
    pageRef.current = 1;
    loadPageRef.current(1, false);
  }, [currentFilterKey]);

  const loadProducts = useCallback(() => {
    pageRef.current = 1;
    loadPageRef.current(1, false);
  }, []);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore || isLoading) return;
    pageRef.current += 1;
    loadPageRef.current(pageRef.current, true);
  }, [loadingMore, hasMore, isLoading]);

  const setCat = (v: string) => {
    setSearchParams((prev) => {
      if (v) prev.set("category", v);
      else prev.delete("category");
      return prev;
    });
  };

  const setMinDiscount = (v: number) => {
    setSearchParams((prev) => {
      if (v > 0) prev.set("minDiscount", String(v));
      else prev.delete("minDiscount");
      return prev;
    });
  };

  const toggleBrand = (brand: string) => {
    setSearchParams((prev) => {
      const current = prev.get("brands")?.split(",").filter(Boolean) || [];
      const idx = current.indexOf(brand);
      if (idx >= 0) current.splice(idx, 1);
      else current.push(brand);
      if (current.length > 0) prev.set("brands", current.join(","));
      else prev.delete("brands");
      return prev;
    });
  };

  const setPrice = (v: [number, number]) => {
    setSearchParams((prev) => {
      prev.set("minPrice", String(v[0]));
      prev.set("maxPrice", String(v[1]));
      return prev;
    });
  };

  const setMinRating = (v: number) => {
    setSearchParams((prev) => {
      if (v > 0) prev.set("minRating", String(v));
      else prev.delete("minRating");
      return prev;
    });
  };

  const selectedBrands = brands ? brands.split(",") : [];

  return {
    products,
    isLoading,
    loadingMore,
    hasMore,
    error,
    loadProducts,
    loadMore,
    filters: {
      cat,
      setCat,
      q,
      selectedBrands,
      toggleBrand,
      price: [Number(minPrice) || 0, Number(maxPrice) || 2500] as [number, number],
      setPrice,
      minRating: Number(minRating) || 0,
      setMinRating,
      minDiscount: Number(minDiscount) || 0,
      setMinDiscount,
    },
  };
}
