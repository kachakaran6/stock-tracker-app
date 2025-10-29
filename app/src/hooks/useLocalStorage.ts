// src/hooks/useLocalStorage.ts
import { useState, useEffect } from "react";
import { Transaction } from "../types/Transaction";

const STORAGE_KEY = "stockTransactions";

export const useTransactions = () => {
  // 1. Initialize state with data from localStorage on component mount
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // 2. Persist state to localStorage whenever the 'transactions' state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [transactions]);

  // 3. CRUD operations
  const addTransaction = (
    newTransaction: Omit<Transaction, "id" | "totalAmount">
  ) => {
    const id = Date.now().toString(); // Simple ID generation
    const totalAmount = newTransaction.quantity * newTransaction.price;
    const transactionWithTotal: Transaction = {
      ...newTransaction,
      id,
      totalAmount,
    };
    setTransactions((prev) => [...prev, transactionWithTotal]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return { transactions, addTransaction, deleteTransaction };
};
