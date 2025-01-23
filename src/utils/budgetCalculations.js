// budgetCalculations.js
export const calculateBudgetSummary = (transactions, salary, budgetPercentages) => {
  if (!transactions || !salary || !budgetPercentages) {
    console.error('Missing required data: transactions, salary, or budgetPercentages');
    return { totals: {}, budgetSummary: {}, chartData: [] };
  }

  const totals = transactions.reduce((acc, txn) => {
    // Ensure txn.type is valid and exists in budgetPercentages
    if (budgetPercentages[txn.type] !== undefined) {
      acc[txn.type] = (acc[txn.type] || 0) + txn.expense; // Accumulate expenses for each category
    }
    return acc;
  }, { Needs: 0, Wants: 0, Investments: 0, Marriage: 0 });

  const budgetSummary = Object.keys(budgetPercentages).reduce((acc, key) => {
    acc[key] = (budgetPercentages[key] / 100) * salary; // Allocate the salary based on percentages
    return acc;
  }, {});

  const chartData = Object.keys(totals).map((key) => ({
    name: key,
    value: totals[key],
  }));

  return { totals, budgetSummary, chartData };
};
