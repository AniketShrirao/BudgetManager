// TransactionTable.js
import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TableContainer,
  Paper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; // Importing Delete Icon
import { deleteTransaction } from "../services/transactionsService";

export const TransactionsTable = ({ transactions, setTransactions, page, setPage }) => {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedTxn, setSelectedTxn] = React.useState(null);
  const theme = useTheme();

  // Mobile and tablet detection below 1024px
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  // Determine row highlight color for colorblind accessibility
  const getRowColor = ({ important, once_per_month, once_per_quarter }) => {
    if (important) return "#FFB6B6"; // Soft red for important (colorblind-safe)
    if (once_per_quarter) return "#B0C4DE"; // Light blue for once per quarter (colorblind-safe)
    if (once_per_month) return "#98FB98"; // Light green for once per month (colorblind-safe)
    return "transparent"; // Default
  };

  // Render a circle with the respective color
  const renderStatusCircle = (txn) => {
    let color = "transparent"; // Default
    let label = "";
    if (txn.important) {
      color = "#FF6A6A"; // Strong red for important (colorblind-safe)
      label = "Important";
    } else if (txn.once_per_quarter) {
      color = "#87CEFA"; // Sky blue for once per quarter (colorblind-safe)
      label = "Quarterly";
    } else if (txn.once_per_month) {
      color = "#32CD32"; // Lime green for once per month (colorblind-safe)
      label = "Monthly";
    }

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: color,
            marginRight: "8px",
          }}
        />
        <Typography variant="body2" style={{ fontSize: "0.8em" }}>
          {label}
        </Typography>
      </div>
    );
  };

  // Handle row click to show status in a dialog
  const handleRowClick = (txn) => {
    setSelectedTxn(txn);
    setOpenDialog(true);
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTxn(null);
  };

  // Handle the delete action
  const handleDelete = async (txnId) => {
    // Delete the transaction by filtering it out
    await deleteTransaction(txnId);
    setTransactions(transactions.filter((txn) => txn.id !== txnId)); // Assuming each transaction has a unique `id`
  };

  // Paginate transactions
  const paginatedTransactions = transactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      {transactions.length > 0 ? (
        <>
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: isMobileOrTablet ? "none" : "calc(100vh - 250px)", // Limit height of the table
            }}
            className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 css-1gtchvp-MuiPaper-root"
          >
            <Table>
              <TableHead>
                <TableRow>
                  {!isMobileOrTablet && <TableCell sx={{ padding: "6px 16px", width: "15%" }}>Date</TableCell>}
                  <TableCell sx={{ padding: "6px 16px", width: "25%" }}>Description</TableCell>
                  <TableCell sx={{ padding: "6px 16px", width: "15%" }}>Expense</TableCell>
                  <TableCell sx={{ padding: "6px 16px", width: "10%" }}>Type</TableCell>
                  {!isMobileOrTablet && <TableCell sx={{ padding: "6px 16px", width: "15%" }}>Category</TableCell>}
                  {!isMobileOrTablet && (
                    <TableCell sx={{ padding: "6px 16px", width: "20%" }}>Status</TableCell>
                  )}
                  <TableCell sx={{ padding: "6px 16px", width: "5%" }}>Actions</TableCell> {/* Action column */}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTransactions.map((txn, index) => (
                  <TableRow
                    key={index}
                    onClick={() => isMobileOrTablet && handleRowClick(txn)} // Only show popup on mobile/tablet
                    style={{
                      backgroundColor: getRowColor(txn),
                      cursor: isMobileOrTablet ? "pointer" : "default",
                    }}
                  >
                    {!isMobileOrTablet && <TableCell sx={{ padding: "6px 16px" }}>{txn.date}</TableCell>}
                    <TableCell sx={{ padding: "6px 16px" }}>{txn.description}</TableCell>
                    <TableCell sx={{ padding: "6px 16px" }}>₹{txn.expense.toFixed(2)}</TableCell>
                    <TableCell sx={{ padding: "6px 16px" }}>{txn.type}</TableCell>
                    {!isMobileOrTablet && <TableCell sx={{ padding: "6px 16px" }}>{txn.category}</TableCell>}
                    {!isMobileOrTablet && (
                      <TableCell sx={{ padding: "6px 16px" }}>{renderStatusCircle(txn)}</TableCell>
                    )}
                    <TableCell sx={{ padding: "6px 16px" }}>
                      {/* Delete icon */}
                      <IconButton onClick={() => handleDelete(txn.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={transactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={isMobileOrTablet ? "" : undefined} // Hide the "Rows per page" label on mobile/tablet
          />

          {/* Dialog for showing status, category, and date only for mobile/tablet */}
          {isMobileOrTablet && (
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>Status Information</DialogTitle>
              <DialogContent>
                {selectedTxn && (
                  <>
                    <Typography variant="body1">
                      <strong>Date:</strong> {selectedTxn.date}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Status:</strong>{" "}
                      {selectedTxn.important
                        ? "Important"
                        : selectedTxn.once_per_quarter
                        ? "Quarterly"
                        : selectedTxn.once_per_month
                        ? "Monthly"
                        : "Not Specified"}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Category:</strong> {selectedTxn.category}
                    </Typography>
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </>
      ) : (
        <Typography variant="h6" align="center" style={{ margin: "20px 0" }}>
          No transactions available for this month.
        </Typography>
      )}
    </>
  );
};
