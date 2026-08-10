import { useEffect, useMemo, useState } from "react"
import { productCatalog as fallbackProducts } from "../data/products"

export function useProducts() {
  const [state, setState] = useState({ loading: true, products: fallbackProducts, source: "fallback" })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const response = await fetch("/api/products", {
          credentials: "include",
          headers: { Accept: "application/json" },
        })
        if (!response.ok) throw new Error("PRODUCTS_API_UNAVAILABLE")
        const data = await response.json()
        if (!cancelled && Array.isArray(data?.products) && data.products.length) {
          setState({ loading: false, products: data.products, source: "database" })
          return
        }
      } catch {
        // The static fallback keeps the public website available if the database is not ready yet.
      }

      if (!cancelled) setState({ loading: false, products: fallbackProducts, source: "fallback" })
    }

    load()
    return () => { cancelled = true }
  }, [])

  const stats = useMemo(() => {
    const products = state.products || []
    return {
      total: products.length,
      live: products.filter((item) => item.status === "ACTIVE").length,
      building: products.filter((item) => item.status === "COMING_SOON").length,
    }
  }, [state.products])

  return { ...state, stats }
}
