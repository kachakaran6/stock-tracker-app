// src/types/Transaction.ts

export type TransactionType = "Buy" | "Sell";

export interface Transaction {
  id: string; // Unique ID (e.g., using a library like uuid or a timestamp)
  stockName: string;
  type: TransactionType;
  quantity: number;
  price: number; // Price per share
  date: string; // ISO string for Date/Time
  totalAmount: number; // Calculated field: quantity * price
}
