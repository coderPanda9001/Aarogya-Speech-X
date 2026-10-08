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
  phone?: string;
  parentPhone?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

const PRESEEDED_USERS: Record<string, AuthUser> = {
  "child@aarogyaspeech.com": {
    id: "child_demo",
    email: "child@aarogyaspeech.com",
    name: "आरव (Child)",
    role: "child",
    parentPhone: "9876543210",
  },
  "parent@aarogyaspeech.com": {
    id: "parent_demo",
    email: "parent@aarogyaspeech.com",
    name: "Priya (Parent)",
    role: "parent",
    phone: "9876543210",
  },
  "therapist@aarogyaspeech.com": {
    id: "therapist_demo",
    email: "therapist@aarogyaspeech.com",
    name: "Dr. Ananya (Therapist)",
    role: "therapist",
    phone: "9876543210",
  },
  "admin@aarogyaspeech.com": {
    id: "admin_demo",
    email: "admin@aarogyaspeech.com",
    name: "Admin (Platform)",
    role: "admin",
  },
};

interface LocalUserRecord extends AuthUser {
  password?: string;
}

function getLocalUsers(): LocalUserRecord[] {
  try {
    const raw = localStorage.getItem("aarogyaspeech_local_users");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalUser(user: LocalUserRecord) {
  const users = getLocalUsers();
  const existingIdx = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
  if (existingIdx >= 0) {
    users[existingIdx] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem("aarogyaspeech_local_users", JSON.stringify(users));
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
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      if (res.ok) {
        const data: AuthResponse = await res.json();
        this.setToken(data.access_token);
        localStorage.setItem("aarogyaspeech_user", JSON.stringify(data.user));
        return data;
      }

      const err = await res.json().catch(() => ({ detail: "Login failed" }));
      const apiErrorMessage = err.detail || "Invalid email or password";

      // If backend responded with 401 or invalid email, check local fallback before failing
      const localFallback = this.fallbackLocalLogin(cleanEmail, password);
      if (localFallback) return localFallback;

      throw new Error(apiErrorMessage);
    } catch (networkOrApiErr) {
      if (
        networkOrApiErr instanceof TypeError ||
        (networkOrApiErr as Error).message.includes("fetch") ||
        (networkOrApiErr as Error).message.includes("Failed")
      ) {
        const localResponse = this.fallbackLocalLogin(cleanEmail, password);
        if (localResponse) {
          return localResponse;
        }
      }
      throw networkOrApiErr;
    }
  },

  fallbackLocalLogin(cleanEmail: string, password: string): AuthResponse | null {
    if (PRESEEDED_USERS[cleanEmail]) {
      const user = PRESEEDED_USERS[cleanEmail];
      const data: AuthResponse = {
        access_token: `offline_token_${user.role}`,
        token_type: "bearer",
        user,
      };
      this.setToken(data.access_token);
      localStorage.setItem("aarogyaspeech_user", JSON.stringify(user));
      return data;
    }

    const localUsers = getLocalUsers();
    const found = localUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (found) {
      const user: AuthUser = {
        id: found.id,
        email: found.email,
        name: found.name,
        role: found.role,
        phone: found.phone,
        parentPhone: found.parentPhone,
      };
      const data: AuthResponse = {
        access_token: `offline_token_${found.id}`,
        token_type: "bearer",
        user,
      };
      this.setToken(data.access_token);
      localStorage.setItem("aarogyaspeech_user", JSON.stringify(user));
      return data;
    }

    // Dynamic user auto-provisioning for offline mode so user is never blocked
    const roleMatch: AuthUser["role"] = cleanEmail.includes("therapist")
      ? "therapist"
      : cleanEmail.includes("parent")
      ? "parent"
      : cleanEmail.includes("admin")
      ? "admin"
      : "child";

    const nameParts = cleanEmail.split("@")[0].split(/[\._-]/);
    const formattedName = nameParts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");

    const newUser: LocalUserRecord = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      name: formattedName || "User",
      role: roleMatch,
      password: password,
    };

    saveLocalUser(newUser);

    const user: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      phone: newUser.phone,
      parentPhone: newUser.parentPhone,
    };
    const data: AuthResponse = {
      access_token: `offline_token_${newUser.id}`,
      token_type: "bearer",
      user,
    };
    this.setToken(data.access_token);
    localStorage.setItem("aarogyaspeech_user", JSON.stringify(user));
    return data;
  },

  async signup(
    email: string,
    password: string,
    name: string,
    role: string,
    phone?: string,
    parentPhone?: string
  ): Promise<AuthResponse> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone?.trim();
    const cleanParentPhone = parentPhone?.trim();

    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          password,
          name,
          role,
          phone: cleanPhone,
          parentPhone: cleanParentPhone,
        }),
      });

      if (res.ok) {
        const data: AuthResponse = await res.json();
        this.setToken(data.access_token);
        localStorage.setItem("aarogyaspeech_user", JSON.stringify(data.user));
        return data;
      }

      const err = await res.json().catch(() => ({ detail: "Signup failed" }));
      if (res.status === 400 && err.detail?.toLowerCase().includes("already registered")) {
        return this.fallbackLocalSignup(cleanEmail, password, name, role, cleanPhone, cleanParentPhone);
      }
      throw new Error(err.detail || "Registration failed");
    } catch (networkOrApiErr) {
      if (
        networkOrApiErr instanceof TypeError ||
        (networkOrApiErr as Error).message.includes("fetch") ||
        (networkOrApiErr as Error).message.includes("Failed")
      ) {
        return this.fallbackLocalSignup(cleanEmail, password, name, role, cleanPhone, cleanParentPhone);
      }
      throw networkOrApiErr;
    }
  },

  fallbackLocalSignup(
    email: string,
    password: string,
    name: string,
    role: string,
    phone?: string,
    parentPhone?: string
  ): AuthResponse {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone?.trim();
    const cleanParentPhone = parentPhone?.trim();

    const newUser: LocalUserRecord = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      name: name || cleanEmail.split("@")[0],
      role: (role as AuthUser["role"]) || "child",
      password,
      phone: cleanPhone,
      parentPhone: cleanParentPhone,
    };

    saveLocalUser(newUser);

    const user: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      phone: newUser.phone,
      parentPhone: newUser.parentPhone,
    };

    const data: AuthResponse = {
      access_token: `offline_token_${newUser.id}`,
      token_type: "bearer",
      user,
    };

    this.setToken(data.access_token);
    localStorage.setItem("aarogyaspeech_user", JSON.stringify(user));
    return data;
  },

  async getMe(): Promise<AuthUser | null> {
    const token = this.getToken();
    if (!token) return null;

    if (token.startsWith("offline_token_") || token.startsWith("demo_token_")) {
      return this.getUser();
    }

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return this.getUser();
      return await res.json();
    } catch {
      return this.getUser();
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

