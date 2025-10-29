// src/components/DashboardSummary.tsx

import React from "react";

// Assuming an Analytics type defined in useAnalytics.ts
interface Analytics {
  totalInvestment: number;
  totalReturns: number;
  netProfitLoss: number;
}

interface DashboardSummaryProps {
  analytics: Analytics;
}

const formatCurrency = (value: number) => {
  // Using 'en-IN' locale for correct Indian numbering format (lacs/crores)
  // Using 'INR' for the currency symbol (₹)
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(value);
};

const SummaryCard: React.FC<{
  title: string;
  value: number;
  colorClass?: string;
}> = ({ title, value, colorClass = "text-gray-900 dark:text-white" }) => (
  // Responsive Padding: p-4 for small screens, p-5/p-6 for larger ones
  <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 sm:p-5 md:p-6 transition-transform hover:scale-[1.02] duration-300 transform">
    <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">
      {title}
    </p>
    {/* Responsive Text Size: text-2xl for mobile, text-3xl for desktop */}
    <p className={`mt-1 text-2xl sm:text-3xl font-bold ${colorClass}`}>
      {formatCurrency(value)}
    </p>
  </div>
);

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ analytics }) => {
  const { totalInvestment, totalReturns, netProfitLoss } = analytics;

  // Conditional color for Net Profit/Loss
  const profitLossColor =
    netProfitLoss > 0
      ? "text-green-500"
      : netProfitLoss < 0
      ? "text-red-500"
      : "text-gray-500";

  return (
    // Responsive Grid: 1 column on phone, 2 on small devices (tablets/landscape), 3 on desktop
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      <SummaryCard title="Total Investment (Buy)" value={totalInvestment} />
      <SummaryCard title="Total Returns (Sell)" value={totalReturns} />
      <SummaryCard
        title="Net Profit / Loss"
        value={netProfitLoss}
        colorClass={profitLossColor}
      />
    </div>
  );
};

export default DashboardSummary;

// This component is now fully responsive, correctly handles the display currency in Indian Rupees, and is ready to integrate with the analytics hook!

// Now that the front-end display is set up, let's create the complex and crucial **`useAnalytics.ts` hook** to perform the accurate profit/loss calculation using the **First-In, First-Out (FIFO)** method, as a simple sum of Buy vs. Sell amounts is rarely accurate for portfolio tracking.
