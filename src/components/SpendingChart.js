// SpendingChart.js
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// Function to format the value in INR style (comma separated)
const formatValue = (value) => {
  return `₹${value.toLocaleString("en-IN")}`;
};

const COLORS = {
  "needs": "#e6f69d",   // Red
  "wants": "#aadea7",   // Green
  "investment": "#64c2a6",  // Blue
  "marriage": "#2d87bb", // Yellow
  "Default": "#8884d8"   // Default color for unknown types
};

export const SpendingChart = ({ chartData }) => {
  // Filter out categories with zero value
  const filteredChartData = chartData.filter((entry) => entry.value > 0);

  // If there are no categories with values, show a pie chart with 100% in default color
  const dataToDisplay = filteredChartData.length > 0 
    ? filteredChartData
    : [{ name: "No Data", value: 100 }];

  // Conditionally set the label depending on whether there is data or not
  const showLabels = filteredChartData.length > 0;

  return (
    <PieChart style={{ width: "100%" }} width={100} height={350}>
      <Pie
        style={{ outline: "none" }}
        data={dataToDisplay}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        labelLine={false}  // Removes lines between pie chart and values
        label={showLabels ? ({ name, value }) => `${name}: ${formatValue(value)}` : false} // Show label only if data exists
      >
        {dataToDisplay.map((entry, index) => {
          const status = entry.name.toLowerCase(); // Convert to lowercase to match the keys in COLORS
          return (
            <Cell key={`cell-${index}`} fill={COLORS[status] || COLORS.Default} />
          );
        })}
      </Pie>
      {showLabels && <Tooltip formatter={(value) => formatValue(value)} />}  {/* Format tooltip value with ₹ symbol and comma */}
      <Legend 
        layout="horizontal"   // Horizontal layout for the legend
        align="center"         // Align the legend to the center
        verticalAlign="bottom" // Position it at the bottom of the chart
        wrapperStyle={{ width: "100%", paddingTop: "10px" }}  // Make the wrapper take up 100% width
        iconSize={15}          // Adjust icon size if necessary
        iconType="circle"      // Use circle as the default icon shape
      />
    </PieChart>
  );
};
