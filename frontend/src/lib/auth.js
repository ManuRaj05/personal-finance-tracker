"use server";
import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to login")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

export async function register(name, email, username, password) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name, email, username, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to register")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

export async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get("token")?.value;
}

export async function fetchWithAuth(url, options = {}) {
  const token = await getAuthToken()

  if (!token) {
    throw new Error("No authentication token found")
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
}

