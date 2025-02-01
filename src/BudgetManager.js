//BudgetManager.js
import React, { useState, useEffect, useRef } from "react";
import { Typography, Grid, Paper, Button, TextField, IconButton, Tooltip } from "@mui/material";
import { BudgetForm } from "./components/BudgetForm";
import { TransactionsTable } from "./components/TransactionTable";
import { BudgetSummary } from "./components/BudgetSummary";
import { SpendingChart } from "./components/SpendingChart";
import { calculateBudgetSummary } from "./utils/budgetCalculations";
import moment from "moment";
import { DownloadTransactions } from "./components/DownloadTransactions";
import EditIcon from "@mui/icons-material/Edit";
import supabase from "./supabaseClient";

const BudgetManager = () => {
  const defaultSalary = 89447; // Default salary
  const defaultPercentages = { Needs: 50, Wants: 30, Investments: 15, Marriage: 5 }; // Default budget percentages

  // Retrieve stored salary from localStorage or use default salary
  const getStoredSalary = () => {
    const storedSalary = localStorage.getItem("salary_current_month");
    return storedSalary ? parseFloat(storedSalary) : defaultSalary;
  };

  const [transactions, setTransactions] = useState([]);
  const [currentMonthTransactions, setCurrentMonthTransactions] = useState([]);
  const [salary, setSalary] = useState(getStoredSalary()); // Set the initial salary from localStorage
  const [currentMonth, setCurrentMonth] = useState(moment().format("MMMM YYYY"));
  const [page, setPage] = useState(0); // New state to track pagination
  const [editingSalary, setEditingSalary] = useState(false); // Track whether salary is being edited
  const [newSalary, setNewSalary] = useState(salary); // Temporary state for editing salary

  // Ref for the input element
  const salaryInputRef = useRef(null);

  // Budget percentages state
  const [budgetPercentages, setBudgetPercentages] = useState(defaultPercentages);


  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });  // Sort transactions by date

      if (error) {
        console.error("Error fetching transactions:", error);
      } else {
        setTransactions(data);
      }
    };

    fetchTransactions();
  }, []);


  // Function to handle adding new transaction
  const handleAddTransaction = (newTransaction) => {
    setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
  };

  // Function to handle changing the month
  const handleChangeMonth = (direction) => {
    const newMonth = moment(currentMonth, "MMMM YYYY")
      .add(direction, "months")
      .format("MMMM YYYY");
    setCurrentMonth(newMonth);
    setPage(0); // Reset pagination to the first page
  };

  // Group transactions by month and return the grouped object
  const groupTransactionsByMonth = (transactions) => {
    const grouped = transactions.reduce((acc, txn) => {
      const parsedDate = moment(txn.date, "YYYY-MM-DD"); // Adjust format to match your data
      if (!parsedDate.isValid()) {
        console.error(`Invalid date: ${txn.date}`);
        return acc;
      }
      const monthKey = parsedDate.format("MMMM YYYY");
      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(txn);
      return acc;
    }, {});
    return grouped;
  };

  // Recalculate current month's transactions whenever `transactions` or `currentMonth` changes
  useEffect(() => {
    const groupedTransactions = groupTransactionsByMonth(transactions);
    setCurrentMonthTransactions(groupedTransactions[currentMonth] || []);
  }, [transactions, currentMonth]);

  // Recalculate the budget summary whenever `transactions`, `salary`, or `budgetPercentages` changes
  const { totals, budgetSummary, chartData } = calculateBudgetSummary(currentMonthTransactions, salary, budgetPercentages);

  // Handle percentage change
  const handlePercentageChange = (e) => {
    const { name, value } = e.target;
    const updatedPercentages = { ...budgetPercentages, [name]: parseInt(value) };
    setBudgetPercentages(updatedPercentages);
  };

  // Store the salary in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("salary_current_month", salary); // Store updated salary
  }, [salary]);

  // Function to handle saving the new salary when input loses focus
  const handleBlur = () => {
    setSalary(newSalary); // Save the updated salary
    setEditingSalary(false); // Exit editing mode
  };

  // Function to handle input change
  const handleSalaryChange = (e) => {
    setNewSalary(parseFloat(e.target.value) || defaultSalary); // Update the temporary state
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Budget Manager
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper style={{ padding: "15px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <TextField
                fullWidth
                type="number"
                label="Salary"
                value={editingSalary ? newSalary : salary}
                onChange={handleSalaryChange}
                onBlur={handleBlur} // Save salary when input loses focus
                style={{ marginBottom: "20px" }}
                disabled={!editingSalary} // Disable input when not editing
                inputRef={salaryInputRef} // Reference to the input element
              />
              <Tooltip title="Click on the pencil icon to edit the salary" arrow>
                <IconButton onClick={() => setEditingSalary(true)} color="primary">
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </div>
            <BudgetForm handleAddTransaction={handleAddTransaction} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper style={{ padding: "15px" }}>
            <DownloadTransactions transactions={transactions} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button onClick={() => handleChangeMonth(-1)}>Previous Month</Button>
              <Typography variant="h6">{currentMonth}</Typography>
              <Button onClick={() => handleChangeMonth(1)}>Next Month</Button>
            </div>
            <TransactionsTable
              setTransactions={setTransactions}
              transactions={currentMonthTransactions}
              page={page}
              setPage={setPage} // Pass setPage to reset pagination when needed
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: "15px" }}>
            <BudgetSummary
              budgetPercentages={budgetPercentages}
              salary={salary}
              totals={totals}
              budgetSummary={budgetSummary}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: "15px" }}>
            <SpendingChart chartData={chartData} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default BudgetManager;
