import api from './client';

/**
 * Extract access token from various backend response shapes.
 */
function extractToken(data) {
  if (!data || typeof data !== 'object') return null;
  return (
    data.access_token ||
    data.token ||
    (data.data && (data.data.access_token || data.data.token)) ||
    null
  );
}

/**
 * Try a list of endpoints until one succeeds.
 */
async function tryEndpoints(method, endpoints, payload) {
  let lastError;
  for (const path of endpoints) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const res = await api.request({
        url: path,
        method,
        data: payload
      });
      return res;
    } catch (err) {
      lastError = err;
      if (err?.response?.status === 404 || err?.response?.status === 405) {
        // try next
        // continue
      } else {
        throw err;
      }
    }
  }
  throw lastError || new Error('All endpoints failed');
}

// PUBLIC_INTERFACE
export async function login(email, password) {
  /** Attempt common auth endpoints and return a normalized response with token. */
  const res = await tryEndpoints('post', ['/auth/login', '/login', '/users/login'], {
    email,
    password
  });
  const token = extractToken(res.data);
  return { token, raw: res.data };
}

// PUBLIC_INTERFACE
export async function register(email, password) {
  /** Attempt common register endpoints and return a normalized response with token if provided. */
  const res = await tryEndpoints('post', ['/auth/register', '/register', '/users/register'], {
    email,
    password
  });
  const token = extractToken(res.data);
  return { token, raw: res.data };
}
