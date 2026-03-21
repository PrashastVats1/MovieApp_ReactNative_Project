import { useCallback, useEffect, useRef, useState } from "react";

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchFunctionRef = useRef(fetchFunction);
  fetchFunctionRef.current = fetchFunction;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunctionRef.current();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  // Re-fetch when fetchFunction changes (when searchQuery changes)
  useEffect(() => {
    fetchData();
  }, [fetchFunction]);

  return { data, loading, error, refetch: fetchData, reset };
};

export default useFetch;
