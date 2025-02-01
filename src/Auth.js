import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Paper, Snackbar, Box } from "@mui/material";
import { Alert } from "@mui/material";
import supabase from "./supabaseClient";

const Auth = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session && !error) {
        onAuthSuccess();
      }
    };
    checkSession();
  }, [onAuthSuccess]);

  const handleSendMagicLink = async () => {
    if (!email) {
      setSnackbarMessage("Please enter a valid email address.");
      setSnackbarOpen(true);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setSnackbarMessage(`Error: ${error.message}`);
    } else {
      setSnackbarMessage("Magic Link sent successfully! Please check your email.");
      setIsLinkSent(true);
    }
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <Paper
        sx={{
          padding: 3,
          textAlign: "center",
          width: "100%",
          maxWidth: 400,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Login with Magic Link
        </Typography>
        <TextField
          fullWidth
          label="Email Address"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLinkSent}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMagicLink}
          disabled={isLinkSent}
          fullWidth
        >
          {isLinkSent ? "Magic Link Sent" : "Send Magic Link"}
        </Button>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.startsWith("Error") ? "error" : "success"}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default Auth;