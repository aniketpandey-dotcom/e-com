"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function useProductSearch(query: string) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: ["products", debouncedQuery],

    queryFn: async () => {
      const res = await fetch(
        `https://dummyjson.com/products/search?q=${debouncedQuery}`,
      );

      return res.json();
    },

    enabled: debouncedQuery.length >= 2,

    placeholderData: (previous) => previous,
  });
}
