/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/page.tsx
"use client";

import { useTransactions } from ".//src/hooks/useLocalStorage";
import { useAnalytics } from ".//src/hooks/useAnalytics";
import { exportToCSV } from ".//src/utils/csvExport";
import { useState } from "react";
import DashboardSummary from ".//components/DashboardSummary";
import TransactionTable from ".//components/TransactionTable";
import TransactionFormModal from ".//components/TransactionFormModal"; // Assuming a modal component
import { PlusIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const { transactions, addTransaction, deleteTransaction } = useTransactions();
  const analytics = useAnalytics(transactions);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExport = () => {
    exportToCSV(transactions, "stock_transactions_data.csv");
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
        📈 Stock Tracker Dashboard
      </h1>

      {/* --- Dashboard Summary Cards --- */}
      <DashboardSummary analytics={analytics} />

      <div className="my-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 sm:mb-0">
          Transaction History
        </h2>

        {/* Key Change: Stacking on mobile, horizontal on medium screens */}
        <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-4">
          {/* Export Button */}
          <button
            onClick={handleExport}
            // Ensure button takes full width on mobile, and standard width on desktop
            className="flex-shrink-0 w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Export CSV
          </button>

          {/* Add Transaction Button (Opens Modal) */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-shrink-0 w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors shadow-md"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            New Transaction
          </button>
        </div>
      </div>

      {/* --- Transaction Table --- */}
      <TransactionTable
        transactions={transactions}
        onDelete={deleteTransaction}
      />

      {/* --- Transaction Form Modal --- */}
      <TransactionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          const cleanedData = {
            ...data,
            quantity: Number(data.quantity) || 0,
            price: Number(data.price) || 0,
          };
          addTransaction(cleanedData as any);

          setIsModalOpen(false);
        }}
      />
    </main>
  );
}
