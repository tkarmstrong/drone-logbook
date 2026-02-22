const API_BASE = '/api';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export async function register(payload: RegisterPayload): Promise<string> {
  const res = await fetch(`${API_BASE}/auth/register/${encodeURIComponent(payload.email)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.text ?? `Registration failed: ${res.status}`;
    throw new Error(message);
  }
  return data as string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function login(payload: LoginPayload): Promise<string> {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = (data?.message as string) ?? `Login failed: ${res.status}`;
    throw new Error(message);
  }
  return data as string;
}
