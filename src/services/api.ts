/// <reference types="vite/client" />

export const getApiBase = (): string => {
  const env = (import.meta as any).env || {};
  const envUrl = env.VITE_API_URL || env.VITE_API_BASE_URL;
  if (envUrl) {
    const clean = envUrl.replace(/\/$/, "");
    return clean.endsWith("/api/v1") ? clean : `${clean}/api/v1`;
  }
  return "http://localhost:8000/api/v1";
};

const API_BASE = getApiBase();

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "child" | "parent" | "therapist" | "admin";
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export const authService = {
  getToken(): string | null {
    return localStorage.getItem("aarogyaspeech_token");
  },

  setToken(token: string) {
    localStorage.setItem("aarogyaspeech_token", token);
  },

  clearToken() {
    localStorage.removeItem("aarogyaspeech_token");
    localStorage.removeItem("aarogyaspeech_user");
  },

  getUser(): AuthUser | null {
    const raw = localStorage.getItem("aarogyaspeech_user");
    return raw ? JSON.parse(raw) : null;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Login failed" }));
      throw new Error(err.detail || "Invalid email or password");
    }

    const data: AuthResponse = await res.json();
    this.setToken(data.access_token);
    localStorage.setItem("aarogyaspeech_user", JSON.stringify(data.user));
    return data;
  },

  async signup(email: string, password: string, name: string, role: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, role }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Signup failed" }));
      throw new Error(err.detail || "Registration failed");
    }

    const data: AuthResponse = await res.json();
    this.setToken(data.access_token);
    localStorage.setItem("aarogyaspeech_user", JSON.stringify(data.user));
    return data;
  },

  async getMe(): Promise<AuthUser | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },
};

export const therapistService = {
  async submitReview(observationId: string, action: "accept" | "modify" | "reject", note: string = "") {
    try {
      const res = await fetch(`${API_BASE}/therapist/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ observationId, action, note }),
      });
      return await res.json();
    } catch (e) {
      console.warn("Failed to post therapist review to SQLite API", e);
    }
  },
};
