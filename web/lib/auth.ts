import "server-only";

import { cache } from "react";

import { getSession } from "@/lib/session";
import { getApiBaseUrl } from "@/lib/env";

type ApiUser = {
  id?: string | number;
  email?: string;
  name?: string;
  apiKey?: string;
  api_key?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  apiKey: string;
  createdAt: string;
  updatedAt: string;
};

const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

type FetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

async function fetchFromApi(path: string, options: FetchOptions = {}) {
  const token = getSession();

  if (!token) {
    return null;
  }

  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    console.error("API base URL is not configured");
    return null;
  }
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      return null;
    }

    throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
  }

  return response.json();
}

function normalizeUser(data: unknown): AuthUser | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const payload = data as { user?: ApiUser } & ApiUser;
  const user = payload.user ?? payload;

  if (!user || typeof user !== "object") {
    return null;
  }

  const { id, email, name } = user;

  if (!id || !email || !name) {
    return null;
  }

  const createdAt = "createdAt" in user && user.createdAt
    ? user.createdAt
    : "created_at" in user && user.created_at
      ? user.created_at
      : new Date().toISOString();

  const updatedAt = "updatedAt" in user && user.updatedAt
    ? user.updatedAt
    : "updated_at" in user && user.updated_at
      ? user.updated_at
      : createdAt;

  const apiKey =
    ("apiKey" in user && typeof user.apiKey === "string" && user.apiKey) ||
    ("api_key" in user && typeof user.api_key === "string" && user.api_key) ||
    "";

  return {
    id: String(id),
    email: String(email),
    name: String(name),
    apiKey,
    createdAt,
    updatedAt,
  };
}

export const getCurrentUser = cache(async () => {
  try {
    const data = await fetchFromApi("/auth/me");

    if (!data) {
      return null;
    }

    return normalizeUser(data);
  } catch (error) {
    console.error("Failed to get current user", error);
    return null;
  }
});

export const SESSION_MAX_AGE_SECONDS = DEFAULT_MAX_AGE_SECONDS;
