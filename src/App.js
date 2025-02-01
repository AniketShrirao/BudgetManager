import React, { useState } from "react";
import Auth from "./Auth";
import BudgetManager from "./BudgetManager";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return isAuthenticated ? (
    <BudgetManager />
  ) : (
    <Auth onAuthSuccess={() => setIsAuthenticated(true)} />
  );
};

export default App;