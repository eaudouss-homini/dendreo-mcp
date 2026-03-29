// ============================================================
// client.ts — Client HTTP partagé pour l'API Dendreo
// ============================================================

export interface DendreoConfig {
  baseUrl: string;   // ex: https://pro.dendreo.com/VOTRE_COMPTE/api
  apiKey: string;    // Votre clé API Dendreo
}

export class DendreoClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(config: DendreoConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ""); // enlève le slash final si présent
    this.apiKey = config.apiKey;
  }

  async get<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    url.searchParams.set("key", this.apiKey);
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== "") url.searchParams.set(k, v);
    }

    const response = await fetch(url.toString(), {
      headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Dendreo API error ${response.status}: ${text}`);
    }

    return response.json() as Promise<T>;
  }

  async post<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    url.searchParams.set("key", this.apiKey);

    const form = new URLSearchParams();
    for (const [k, v] of Object.entries(body)) {
      if (v !== undefined && v !== null) form.set(k, String(v));
    }

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Dendreo API error ${response.status}: ${text}`);
    }

    return response.json() as Promise<T>;
  }
}
