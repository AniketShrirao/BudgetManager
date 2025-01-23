// BudgetSummary.js
import React, { useState } from "react";
import { Table, TableBody, TableRow, TableCell, Typography, TextField } from "@mui/material";

export const BudgetSummary = ({ salary, totals, budgetSummary, chartData }) => {
  const defaultPercentages = { Needs: 50, Wants: 30, Investments: 15, Marriage: 5 };

  // State for managing budget percentages
  const [budgetPercentages, setBudgetPercentages] = useState(defaultPercentages);

  // Handle percentage change
  const handlePercentageChange = (e, category) => {
    const { value } = e.target;
    const newPercentage = Math.min(Math.max(parseInt(value), 0), 100); // Ensuring the value is between 0 and 100

    // Update the category with the new percentage
    const newBudgetPercentages = { ...budgetPercentages, [category]: newPercentage };

    // Calculate the remaining percentage to be distributed
    const totalPercentage = Object.values(newBudgetPercentages).reduce((sum, percentage) => sum + percentage, 0);
    const remainingPercentage = 100 - totalPercentage;

    // If there's remaining percentage, distribute it equally across the other categories
    if (remainingPercentage > 0) {
      const otherCategories = Object.keys(newBudgetPercentages).filter(key => key !== category);
      const distributedRemainingPercentage = remainingPercentage / otherCategories.length;

      otherCategories.forEach((key) => {
        // Ensure no category goes below 0 or above 100
        newBudgetPercentages[key] = Math.max(0, Math.min(100, newBudgetPercentages[key] + distributedRemainingPercentage));
      });
    }

    setBudgetPercentages(newBudgetPercentages); // Update state with new percentages
  };

  return (
    <div>
      <Typography variant="h6" style={{ marginBottom: "20px" }}>
        Budget Summary
      </Typography>
      <Table>
        <TableBody>
          {Object.keys(budgetSummary).map((key) => {
            // Calculate the allocated amount based on the budget percentage
            const allocatedAmount = (budgetPercentages[key] / 100) * salary;
            const spentAmount = totals[key] || 0;

            return (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>Allocated: ₹{allocatedAmount.toFixed(2)}</TableCell>
                <TableCell>Spent: ₹{spentAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    label={`${key} %`}
                    value={budgetPercentages[key].toFixed(2)}
                    onChange={(e) => handlePercentageChange(e, key)}
                    inputProps={{ min: 0, max: 100 }}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export const calculateBudgetSummary = (transactions, salary, budgetPercentages) => {
  if (!transactions || !salary || !budgetPercentages) {
    console.error('Missing required data: transactions, salary, or budgetPercentages');
    return { totals: {}, budgetSummary: {}, chartData: [] };
  }

  const totals = transactions.reduce((acc, txn) => {
    // Ensure txn.type is valid and exists in budgetPercentages
    if (budgetPercentages[txn.type] !== undefined) {
      acc[txn.type] += txn.expense;
    }
    return acc;
  }, { Needs: 0, Wants: 0, Investments: 0, Marriage: 0 });

  const budgetSummary = Object.keys(budgetPercentages || {}).reduce((acc, key) => {
    acc[key] = (budgetPercentages[key] / 100) * salary;
    return acc;
  }, {});

  const chartData = Object.keys(totals).map((key) => ({
    name: key,
    value: totals[key],
  }));

  return { totals, budgetSummary, chartData };
};
