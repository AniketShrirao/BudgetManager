// BudgetForm.js
import React, { useState } from "react";
import { TextField, Button, Grid, MenuItem, FormControlLabel, Checkbox, Typography } from "@mui/material";
import { categories } from "../data/categories";
import { addTransaction } from "../services/transactionsService";  // Import service

export const BudgetForm = ({ handleAddTransaction }) => {
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "",
    description: "",
    expense: "",
    type: "Needs",
    important: false,
    once_per_month: false,
    once_per_quarter: false,
  });

  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
    if (name === "category") {
      const selectedCategory = categories.find((cat) => cat.name === value);
      setForm((prev) => ({
        ...prev,
        type: selectedCategory ? selectedCategory.type : "Needs",
      }));
    }
  };

  const handleAddCategory = () => {
    if (newCategory) {
      categories.push({ name: newCategory, type: "Needs" });
      setNewCategory("");
    }
  };

  const handleSubmit = async () => {
    // Validation for required fields
    if (!form.date || !form.category || !form.expense || !form.type) {
      setError("Please fill in all required fields: Date, Category, Expense, and Type.");
      return;
    }

    try {
      // Call addTransaction from service
      const data = await addTransaction({
        date: form.date,
        category: form.category,
        description: form.description,
        expense: parseFloat(form.expense),
        type: form.type,
        important: form.important,
        once_per_month: form.once_per_month,
        once_per_quarter: form.once_per_quarter,
      });

      console.log("Transaction added:", data);
      handleAddTransaction(data[0]);  // Pass added transaction to parent

      // Reset form after successful submission
      setForm({
        date: new Date().toISOString().split("T")[0],
        category: "",
        description: "",
        expense: "",
        type: "Needs",
        important: false,
        once_per_month: false,
        once_per_quarter: false,
      });
    } catch (error) {
      console.error("Error inserting transaction:", error);
      setError("Error inserting transaction. Please try again.");
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField
          fullWidth
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          select
          fullWidth
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          {categories.map((cat) => (
            <MenuItem key={cat.name} value={cat.name}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          type="number"
          label="Expense"
          name="expense"
          value={form.expense}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid item xs={6}>
        <TextField fullWidth label="Type" name="type" value={form.type} readOnly />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={<Checkbox checked={form.important} name="important" onChange={handleChange} />}
          label="Important"
        />
        <FormControlLabel
          control={<Checkbox checked={form.once_per_month} name="once_per_month" onChange={handleChange} />}
          label="Once Per Month"
        />
        <FormControlLabel
          control={<Checkbox checked={form.once_per_quarter} name="once_per_quarter" onChange={handleChange} />}
          label="Once Per Quarter"
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Add Transaction
        </Button>
      </Grid>
      {error && (
        <Grid item xs={12}>
          <Typography variant="body2" color="error" align="center">
            {error}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};
