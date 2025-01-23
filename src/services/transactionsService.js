import { supabase } from "../supabase";

// Fetch all transactions
export const fetchTransactions = async () => {
  const { data, error } = await supabase.from("transactions").select("*");
  if (error) throw error;
  return data;
};

// Add a new transaction
export const addTransaction = async (transaction) => {
  const { data, error } = await supabase.from("transactions").insert([transaction]);
  if (error) throw error;
  return data;
};

// Update a transaction
export const updateTransaction = async (id, updatedTransaction) => {
  const { data, error } = await supabase
    .from("transactions")
    .update(updatedTransaction)
    .eq("id", id);
  if (error) throw error;
  return data;
};

// Delete a transaction
export const deleteTransaction = async (id) => {
  const { data, error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
  return data;
};
