// ✅ FIX 1: Match the variable name we set in Vercel (VITE_API_URL)
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

async function fetchJson(path, options = {}) {
  const url = `${BASE}${path}`;
  const headers = options.headers || {};
  
  // Get token from storage
  const token = typeof window !== 'undefined' && localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // ✅ FIX 2: Remove 'same-origin' so it can talk to the backend domain
  const opts = { ...options, headers };

  if (opts.body && headers['Content-Type'] === 'application/json' && typeof opts.body !== 'string') {
    opts.body = JSON.stringify(opts.body);
  }

  console.log('API Request:', { url, method: opts.method || 'GET' });

  const res = await fetch(url, opts);
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    let message = res.statusText;
    if (isJson) {
      try { const d = await res.json(); message = d.message || JSON.stringify(d); } catch(e){}
    } else {
      try { message = await res.text(); } catch(e) {}
    }
    const err = new Error(message || 'Request failed');
    err.status = res.status;
    throw err;
  }

  if (isJson) return res.json();
  return res.text();
}

export { fetchJson, BASE };