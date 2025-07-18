export async function apiFetch(url: string, options?: RequestInit) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      let message = res.statusText;
      try {
        const data = await res.json();
        if (data && data.error) message = data.error;
      } catch {
        // ignore json parse errors
      }
      throw new Error(message);
    }
    return res.json();
  } catch (e: any) {
    throw new Error(e.message || 'Network error');
  }
}
