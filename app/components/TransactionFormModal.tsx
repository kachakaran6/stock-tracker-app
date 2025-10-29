// src/components/TransactionFormModal.tsx
import React, { useState, FormEvent } from "react";
import { TransactionType } from "../src/types/Transaction"; // Make sure this is imported

// Data structure for form submission (before ID/TotalAmount are calculated)
interface FormData {
  stockName: string;
  type: TransactionType;
  quantity: number | string;
  price: number | string;
  date: string;
}

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<FormData, "id">) => void;
}

const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const defaultDate = new Date().toISOString().slice(0, 16);

  const [formData, setFormData] = useState<FormData>({
    stockName: "",
    type: "Buy",
    quantity: "",
    price: "",
    date: defaultDate,
  });

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    }));
  };

  // Inside src/components/TransactionFormModal.tsx

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // 1. Check if the string field is empty
    if (!formData.stockName) {
      alert("Please enter the Stock Name.");
      return;
    }

    // 2. Check if the numerical fields are missing (empty string) or zero
    // Since quantity and price are type 'number | string', checking for empty string ('')
    // and ensuring the parsed number is greater than zero is the most robust validation.
    const quantityNum = Number(formData.quantity);
    const priceNum = Number(formData.price);

    if (formData.quantity === "" || quantityNum <= 0) {
      alert("Please enter a valid Quantity greater than zero.");
      return;
    }

    if (formData.price === "" || priceNum <= 0) {
      alert("Please enter a valid Price per share greater than zero.");
      return;
    }

    // If all validation passes:
    onSave(formData);

    // Reset form after saving
    setFormData({
      stockName: "",
      type: "Buy",
      quantity: "", // Use empty string to clear the input
      price: "", // Use empty string to clear the input
      date: defaultDate,
    });
  };

  // Tailwind Modal structure
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-start pt-10 pb-10 sm:items-center sm:pt-0 sm:pb-0 z-50">
      {/* Inner Modal Container: Controls max-width and internal scrolling */}
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-11/12 sm:max-w-md md:max-w-lg p-6 max-h-[90vh] overflow-y-auto transform transition-all duration-300"
        // Use a max-width utility for better control than fixed width percentage
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
          Add New Transaction
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Form Fields: (No changes needed here, as the fields themselves are already w-full) */}
          <div className="space-y-4">
            {/* Stock Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Stock Name
              </label>
              <input
                type="text"
                name="stockName"
                value={formData.stockName}
                onChange={handleChange}
                placeholder="Enter stock name"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
              />
            </div>

            {/* Type (Buy/Sell) */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
              >
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
              </select>
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity of Stock"
                min="1"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
              />
            </div>

            {/* Price per share */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price per share
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price of Stock"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
              />
            </div>

            {/* Date/Time */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date/Time
              </label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Record Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionFormModal;
