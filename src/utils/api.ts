export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE) {
  throw new Error(
    "❌ Missing environment variable: NEXT_PUBLIC_API_BASE_URL. Please define it in your .env.local file."
  );
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  authToken?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.headers) Object.assign(headers, options.headers);
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

  const url = `${API_BASE}${path}`;
  let responseText = "";

  try {
    const res = await fetch(url, { ...options, headers });
    responseText = await res.text();

    if (!res.ok) {
      console.error(`❌ API Error ${res.status}:`, responseText);

      if (res.status === 500) {
        console.warn("⚠️ Backend returned 500 — using fallback empty data");
        return { applications: [] };
      }

      try {
        const errObj = JSON.parse(responseText);
        throw new Error(errObj.message || "Server error occurred");
      } catch {
        throw new Error("Unexpected server error");
      }
    }

    try {
      return JSON.parse(responseText);
    } catch {
      return responseText;
    }
  } catch (err: any) {
    console.error("🔥 Fetch failed:", err.message);
    return { applications: [] };
  }
}
