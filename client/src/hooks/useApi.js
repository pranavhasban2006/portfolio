import { useEffect, useState } from 'react';

// Fetches from the Express API, falling back to bundled content when the API is unreachable.
export default function useApi(path, fallback) {
  const [data, setData] = useState(fallback);
  useEffect(() => {
    let alive = true;
    fetch(`/api${path}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((json) => alive && setData(json))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [path]);
  return data;
}
