import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/common/AdminSidebar";
import Header from "../../components/common/Header";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Modal from "@mui/material/Modal";
import { getOrders, updateOrder, handelViewOrder } from "../../api/index";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const editOptions = ["Pending", "Completed", "Processing", "Out of delivery"];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        console.log("Fetched orders:", response);
        setOrders(response.data.orders);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleSave = async (orderId, index) => {
    try {
      const updatedStatus =  selectedStatus;
      console.log("Updating order:", updatedStatus);
      console.log("Order ID:", orderId);
      await updateOrder(orderId, updatedStatus);

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order, i) =>
          i === index ? { ...order, orderStatus: selectedStatus } : order
        )
      );
      setEditIndex(-1);
      setSelectedStatus("");
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleViewProducts = async (orderId) => {
    console.log("Selected Order ID:", orderId);
    setLoadingProducts(true);
    const selectedOrder = orders.find((order) => order._id === orderId);
    console.log("Selected Order:", selectedOrder);
    if (selectedOrder) {
      setProductDetails(selectedOrder.cartItems);
      console.log("Selected Order Details:", productDetails);
    } else {
      setProductDetails([]);
    }
    setLoadingProducts(false); 
    setModalOpen(true);
  
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return { bgcolor: "#dfc9f7", color: "#7c59a4" };
      case "Completed":
        return { bgcolor: "#b3f5ca", color: "#548c6a" };
      case "Processing":
        return { bgcolor: "#feed80", color: "#927b1e" };
      case "Out of delivery":
        return { bgcolor: "#AACCFF", color: "#4793AA" };
      default:
        return {};
    }
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Header />
      </Grid>
      <Grid item xs={12} sm={2}>
        {" "}
        {/* Adjusted width of AdminSidebar */}
        <AdminSidebar />
      </Grid>
      <Grid item xs={12} sm={10}>
        <Box sx={{ p: 3, pl: 2, mt: 5 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
            Orders Management
          </Typography>
          <Box sx={{ mt: 3 }}>
            {loading ? (
              <Typography>Loading orders...</Typography>
            ) : orders.length ? (
              <TableContainer component={Paper} elevation={2}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order</TableCell>
                      <TableCell>Referance No</TableCell>
                      <TableCell>Username</TableCell>
                      <TableCell>Total Amount</TableCell>
                      <TableCell>Shipping Address</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                      <TableCell>Products</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order, index) => (
                      <TableRow key={order._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{order._id}</TableCell>
                        <TableCell>{order.fName} {order.lname}</TableCell>
                        <TableCell>{order.totalPrice}</TableCell>
                        <TableCell>
                          {order.address}, {order.postalcode}
                        </TableCell>
                        <TableCell>
                          {editIndex === index ? (
                            <Select
                              value={selectedStatus}
                              onChange={(e) =>
                                setSelectedStatus(e.target.value)
                              }
                              fullWidth
                            >
                              {editOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          ) : (
                            <Chip
                              label={order.orderStatus}
                              sx={getStatusColor(order.orderStatus)}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {editIndex === index ? (
                            <IconButton
                              onClick={() => handleSave(order._id, index)}
                            >
                              <CheckCircleOutlinedIcon />
                            </IconButton>
                          ) : (
                            <IconButton onClick={() => setEditIndex(index)}>
                              <EditOutlinedIcon />
                            </IconButton>
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton
                             onClick={() => handleViewProducts(order._id)} 
                           >
                            <VisibilityOutlinedIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No orders available</Typography>
            )}
          </Box>
        </Box>
      </Grid>
          <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <Typography variant="h6" mb={2}>
                  Product Details
                </Typography>
                {loadingProducts ? (
                  <Typography>Loading product details...</Typography>
                ) : productDetails.length ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Size</TableCell>
                        <TableCell>Count</TableCell>
                        <TableCell>Unit Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {productDetails.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell>{product.productId.name}</TableCell>
                          <TableCell>{product.clothSize}</TableCell>
                          <TableCell>{product.count}</TableCell>
                          <TableCell>LKR {product.unitPrice} </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography>No product details available</Typography>
                )}
              </Box>
            </Modal>
          </Grid>
  );
}

export default Orders;
