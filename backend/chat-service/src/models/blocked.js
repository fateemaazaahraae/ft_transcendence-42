const REL_SERVICE_URL = process.env.REL_SERVICE_URL || 'http://relationship-service:3002';

async function handleJson(response) {
  const text = await response.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }
  if (!response.ok) {
    const err = new Error(payload?.error || response.statusText || `HTTP ${response.status}`);
    err.status = response.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}

async function block(authHeader, blockerId, blockedId) {
  const response = await fetch(`${REL_SERVICE_URL}/block`, {
    method: 'POST',
    headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
    body: JSON.stringify({ blockedId })
  });
  return handleJson(response);
}

async function unblock(authHeader, blockerId, blockedId) {
  const response = await fetch(`${REL_SERVICE_URL}/unblock`, {
    method: 'POST',
    headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
    body: JSON.stringify({ blockedId })
  });
  return handleJson(response);
}

async function isBlocked(authHeader, blockerId, blockedId) {
  try {
    const headers = {};
    if (authHeader) headers.Authorization = authHeader;
    // for internal callers (no user authHeader) use service token if available
    const svc = process.env.SERVICE_TOKEN;
    if (!authHeader && svc) headers['x-service-token'] = svc;

    const response = await fetch(`${REL_SERVICE_URL}/is-blocked/${blockerId}/${blockedId}`, {
      headers
    });
    const data = await response.json();
    return data.isBlocked || false;
  } catch {
    return false;
  }
}

export default {
  block,
  unblock,
  isBlocked
};
