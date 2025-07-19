import { useState, useEffect } from "react";

const DOCUMENTATION_CACHE_KEY = "orchestration-documentation-cache";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

type CacheEntry = {
  markdown: string;
  timestamp: number;
};

const getCachedDocumentation = (id: string): string | null => {
  try {
    const cache = JSON.parse(localStorage.getItem(DOCUMENTATION_CACHE_KEY) || "{}");
    const cached: CacheEntry | undefined = cache[id];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.markdown;
    }
  } catch (err) {
    console.warn("Failed to read documentation cache:", err);
  }
  return null;
};

const setCachedDocumentation = (id: string, markdown: string) => {
  try {
    const cache = JSON.parse(localStorage.getItem(DOCUMENTATION_CACHE_KEY) || "{}");
    cache[id] = { markdown, timestamp: Date.now() };
    localStorage.setItem(DOCUMENTATION_CACHE_KEY, JSON.stringify(cache));
  } catch (err) {
    console.warn("Failed to write documentation cache:", err);
  }
};

export const useDocumentation = (orchestrationId: string) => {
  const [markdown, setMarkdown] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orchestrationId) return;

    const cached = getCachedDocumentation(orchestrationId);
    if (cached) {
      setMarkdown(cached);
      return;
    }

    const loadDocumentation = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/orchestration-documentation?id=${orchestrationId}`);
        if (!response.ok) throw new Error("Documentation not available");

        const data = await response.json();
        setMarkdown(data.markdown);
        setCachedDocumentation(orchestrationId, data.markdown);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDocumentation();
  }, [orchestrationId]);

  return { markdown, loading, error };
};
