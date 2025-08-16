import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  useMediaQuery,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card as JoyCard,
  CardContent as JoyCardContent,
  Typography as JoyTypography,
} from "@mui/joy";
import {
  getAllProducts,
  getAllUsers,
  getOrders,
  revenueData, 
  predictRevenueDatanext,
} from "../api";
import Button from '@mui/material/Button';

const postalCodeToCityMap = {
  11270: "Demanhandiya ",
  11271: "Mount-Lavanie",
  11566: "Katubedda",
  33601: "Panadura",
  73001: "Moratuwa",
  14526: "Piliyandala",
  45001: "Miriswaththa",
  0: "Unknown City",
};

function AdminOverview() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [error, setError] = useState(null); 
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchRevenueData = async () => {
      try {
        const response = await revenueData(); // call API
        setRevenues(response.data);
        console.log("Revenue Data:", response.data);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchProducts();
    fetchUsers();
    fetchOrders();
    fetchRevenueData();
    setLoading(false);
  }, []);

  const handleClick = async () => {
    try {
      setLoading(true); // Start loading
      setError(null); // Reset error state
      const response = await predictRevenueDatanext();
      setPrediction(response.data);
      console.log("Prediction successful:", response.data);
     
    } catch (error) {
      // Handle error response
      console.error("Error predicting revenue:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  }
  // Aggregate yearly revenue
  const yearlyRevenueData = useMemo(() => {
    const yearMap = {};
    revenues.forEach((entry) => {
      if (!yearMap[entry.year]) {
        yearMap[entry.year] = 0;
      }
      yearMap[entry.year] += entry.revenue;
    });

    return Object.keys(yearMap).map((year) => ({
      name: year,
      value: yearMap[year],
    }));
  }, [revenues]);

  // Metrics
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalUsers = users.length;


  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#FF6384",
    "#AF19FF",
    "#FF4560",
    "#775DD0",
  ];

  return (
    <Box sx={{ padding: 4, fontFamily: "Roboto, Arial, sans-serif" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: "20px",
          background: "linear-gradient(135deg, #B40614, #FF4D4D)",
          borderRadius: "8px",
          boxShadow:
            "0 4px 10px rgba(0, 0, 0, 0.2), 0 0 15px rgba(255, 0, 0, 0.5)",
          mb: 3,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            color: "#ffffff",
            fontWeight: "bold",
            textTransform: "uppercase",
            fontSize: isMobile ? "1.5rem" : "3rem",
          }}
        >
          Admin Dashboard Overview
        </Typography>
      </Box>

      {/* Metrics */}
      <Grid container spacing={3} justifyContent="center">
        {[
          { title: "Total Products", value: totalProducts },
          { title: "Total Orders", value: totalOrders },
          { title: "Total Users", value: totalUsers },
        ].map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <JoyCard
              variant="outlined"
              sx={{
                minHeight: 250,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <JoyCardContent>
                <JoyTypography
                  level="h6"
                  gutterBottom
                  sx={{
                    fontSize: isMobile ? "1rem" : "2rem",
                    textAlign: "center",
                  }}
                >
                  {metric.title}
                </JoyTypography>
                <JoyTypography
                  level="h4"
                  fontWeight="bold"
                  sx={{
                    fontSize: isMobile ? "2rem" : "4.5rem",
                    textAlign: "center",
                  }}
                >
                  {metric.value}
                </JoyTypography>
              </JoyCardContent>
            </JoyCard>
          </Grid>
        ))}
      </Grid>

      {/* Pie Charts Section */}
      <Grid container spacing={3} sx={{ marginTop: 4 }}>
        {/* Yearly Revenue Pie Chart */}
        <Grid item xs={14} md={8}>
          <Typography variant="h5" component="h2" gutterBottom>
            Total Revenue by Year
          </Typography>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={yearlyRevenueData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {yearlyRevenueData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `Rs ${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Orders by Postal Code */}
        <Grid item xs={10} md={4} sx={{ marginTop: 4 }} >
          <Typography variant="h5" component="h2" gutterBottom>
          Want to predict next month’s revenue?
          </Typography>
          {/* <Paper elevation={3} sx={{ padding: 2 }}> */}
          <Paper
            elevation={4}
            sx={{
              padding: 3,
              borderRadius: "16px",
              textAlign: "center",
              background: "linear-gradient(135deg, #FFDEE9, #B5FFFC)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
           
            <Typography variant="body1" sx={{ mb: 2 }}>
              Use AI-powered forecasting to get insights about expected revenue
              trends for the upcoming month.
            </Typography>
            <Button
              variant="contained"
              sx={{
                background: "#B40614",
                "&:hover": { background: "#FF4D4D" },
              }}
              onClick={handleClick}
              disabled={loading}
            >
             {loading ? "Predicting..." : "Predict Now"}
            </Button>
              {/* Display the prediction result */}
              {prediction && (
                  <Typography variant="h6" sx={{ mt: 2, color: "#333" }}>
                    Predicted Revenue for{" "}
                    <span style={{ color: "blue" }}>{prediction.month}</span>{" "}
                    <span style={{ color: "red" }}>LKR:{" "}{prediction.predictedRevenue}</span>
                  </Typography>
                )}

                {/* Display error message if any */}
                {error && (
                  <Typography variant="body2" sx={{ mt: 2, color: "red" }}>
                    {error}
                  </Typography>
                )}
          </Paper>
            
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminOverview;

