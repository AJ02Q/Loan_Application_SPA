const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Login failed');
  return res.json();
}

export async function getLoans(status) {
  const url = new URL(`${API_URL}/loans`);
  if (status) url.searchParams.set('status', status);
  const res = await fetch(url.toString(), { headers: { ...authHeaders() }});
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch loans');
  return res.json();
}

export async function addLoan(payload) {
  const res = await fetch(`${API_URL}/loans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to add loan');
  return res.json();
}

export async function updateLoanStatus(id, status) {
  const res = await fetch(`${API_URL}/loans/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to update status');
  return res.json();
}
