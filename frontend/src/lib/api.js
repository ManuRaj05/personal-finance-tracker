"use server"
import { fetchWithAuth } from "./auth"

// Accounts
export async function getAccounts() {
  const response = await fetchWithAuth("/accounts")
  return response.json()
}

export async function createAccount(data) {
  const response = await fetchWithAuth("/accounts", {
    method: "POST",
    body: JSON.stringify(data),
  })
  return response.json()
}

// Incomes
export async function getIncomes() {
  const response = await fetchWithAuth("/incomes")
  return response.json()
}

export async function createIncome(data) {
  const response = await fetchWithAuth("/incomes", {
    method: "POST",
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to create income")
  }

  return response.json()
}  
// Expenses
export async function getExpenses() {
  const response = await fetchWithAuth("/expenses")
  return response.json()
}

export async function createExpense(data) {
  const response = await fetchWithAuth("/expenses", {
    method: "POST",
    body: JSON.stringify(data),
  })
  return response.json()
}

// Savings
export async function getSavings() {
  const response = await fetchWithAuth("/savings")
  return response.json()
}

export async function createSaving(data) {
  const response = await fetchWithAuth("/savings", {
    method: "POST",
    body: JSON.stringify(data),
  })
  return response.json()
}