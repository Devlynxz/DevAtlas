import { useCallback, useEffect, useState } from "react";
import { listPosts } from "../api/posts";

export function usePosts(params) {
  const [state, setState] = useState({ items: [], total: 0, loading: true, error: null });
  const paramsKey = JSON.stringify(params);

  const fetchPosts = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await listPosts(JSON.parse(paramsKey));
      setState({
        items: response.data.result.items,
        total: response.data.result.total,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({ items: [], total: 0, loading: false, error: "Failed to load articles." });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { ...state, refetch: fetchPosts };
}
