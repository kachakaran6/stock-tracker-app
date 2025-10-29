// src/utils/csvExport.ts
import { Transaction } from "../types/Transaction";

export const exportToCSV = (
  data: Transaction[],
  filename = "stock_transactions.csv"
) => {
  // 1. Define CSV Headers
  const headers = [
    "ID",
    "Stock Name",
    "Type",
    "Quantity",
    "Price",
    "Date",
    "Total Amount",
  ];
  const csvRows = [headers.join(",")];

  // 2. Map data to CSV rows
  for (const item of data) {
    const values = [
      item.id,
      item.stockName,
      item.type,
      item.quantity,
      item.price,
      item.date,
      item.totalAmount,
    ];
    csvRows.push(values.join(","));
  }

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

  // 3. Trigger download
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
