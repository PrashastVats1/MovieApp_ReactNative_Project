import { useCallback, useEffect, useRef, useState } from "react";

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Keep track of the latest fetch function without triggering effects
  const fetchFunctionRef = useRef(fetchFunction);

  useEffect(() => {
    fetchFunctionRef.current = fetchFunction;
  }, [fetchFunction]);

  const fetchData = useCallback(async () => {
    // Only fetch if not already loading
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunctionRef.current();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  }, []); // Stable fetchData function

  // Only auto-run if autoFetch is true OR if the fetchFunction itself
  // is meant to trigger a change (like a search query change)
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchFunction]); // This allows search to work on Main Page

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
