const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ??
  'http://localhost:3000';

const ESCUELA_ID_CONFIGURADA = Number(import.meta.env.VITE_ESCUELA_ID);
export const ESCUELA_ID =
  Number.isInteger(ESCUELA_ID_CONFIGURADA) && ESCUELA_ID_CONFIGURADA > 0
    ? ESCUELA_ID_CONFIGURADA
    : 1;

export async function clienteApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const mensaje = Array.isArray(data.message)
      ? data.message.join(' ')
      : data.message || `Error HTTP ${res.status}`;
    throw new Error(mensaje);
  }

  return data as T;
}