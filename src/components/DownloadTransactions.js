// DownloadTransactions.js

import React from "react";
import { Button } from "@mui/material";
import * as XLSX from "xlsx"; // Make sure you have this package installed

export const DownloadTransactions = ({ transactions }) => {
  // Function to handle the download of transactions as Excel file
  const handleDownload = () => {
    // Group transactions by month (you can adjust this logic as needed)
    const groupedTransactions = transactions.reduce((acc, txn) => {
      const month = new Date(txn.date).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(txn);
      return acc;
    }, {});

    const workbook = XLSX.utils.book_new();

    // Add each month sheet
    for (const month in groupedTransactions) {
      const worksheet = XLSX.utils.json_to_sheet(groupedTransactions[month]);
      XLSX.utils.book_append_sheet(workbook, worksheet, month);
    }

    // Download the Excel file
    XLSX.writeFile(workbook, "Transactions.xlsx");
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleDownload}
      sx={{ marginBottom: 2, alignSelf: 'flex-end' }}
    >
      Download Transactions
    </Button>
  );
};
