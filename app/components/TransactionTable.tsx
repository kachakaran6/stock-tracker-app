// src/components/TransactionTable.tsx
import React, { useState, useMemo } from "react";
import { Transaction } from "../src/types/Transaction";
import {
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

type SortKey = keyof Transaction | "totalAmount";
type SortDirection = "asc" | "desc";

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onDelete,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  }>({
    key: "date",
    direction: "desc",
  });

  const [filterStock, setFilterStock] = useState("");

  const sortedAndFilteredTransactions = useMemo(() => {
    let sortableItems = [...transactions];

    // Filtering
    if (filterStock) {
      sortableItems = sortableItems.filter((t) =>
        t.stockName.toLowerCase().includes(filterStock.toLowerCase())
      );
    }

    // Sorting
    sortableItems.sort((a, b) => {
      const key = sortConfig.key as keyof Transaction;

      let aValue = a[key];
      let bValue = b[key];

      if (key === "quantity" || key === "price" || key === "totalAmount") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (key === "date") {
        // Compare date strings directly
      } else {
        // String comparison
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return sortableItems;
  }, [transactions, sortConfig, filterStock]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowUpIcon className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDownIcon className="w-4 h-4 ml-1" />
    );
  };

  const tableHeaders: { key: SortKey; label: string }[] = [
    { key: "stockName", label: "Stock Name" },
    { key: "type", label: "Type" },
    { key: "quantity", label: "Qty" },
    { key: "price", label: "Price/Share" },
    { key: "totalAmount", label: "Total Amount" },
    { key: "date", label: "Date" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 overflow-x-auto">
      {/* Filter Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by Stock Name..."
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value)}
          className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {tableHeaders.map(({ key, label }) => (
              <th
                key={key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => requestSort(key)}
              >
                <div className="flex items-center">
                  {label}
                  {getSortIcon(key)}
                </div>
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {sortedAndFilteredTransactions.map((t) => (
            <tr
              key={t.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {t.stockName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    t.type === "Buy"
                      ? // Buy: Red for money leaving the account
                        "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                      : // Sell: Green for money returning to the account
                        "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                  }`}
                >
                  {/* The transaction type text is rendered here */}
                  {t.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {t.quantity.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ₹{t.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700 dark:text-gray-200">
                ₹{t.totalAmount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {new Date(t.date).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onDelete(t.id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
          {sortedAndFilteredTransactions.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="text-center py-4 text-gray-500 dark:text-gray-400"
              >
                No transactions recorded. Add a new transaction above.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
