import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { getOrders } from "../api"; // adjust path

const FeedbackTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders(); // adjust if needed
        console.log("Fetched orders:", response);
        if (response && response.data && response.data.orders) {
          setOrders(response.data.orders);
        } else {
          console.error("Invalid response:", response);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Flatten cartItems + keep order-level fields
  const tableData = useMemo(() => {
    return orders.flatMap((order) =>
      order.cartItems.map((item) => ({
        orderId: order._id,
        userName: `${order.fName} ${order.lname}`,
        orderStatus: order.orderStatus,
        feedback: order.feedback || "No feedback",
        rating: order.rating ?? "N/A",
        orderDate: order.date,
        productName: item.productId?.name || "Unknown",
        productImage: item.productId?.imageUrl || "",
        clothSize: item.clothSize,
        unitPrice: item.unitPrice,
        count: item.count,
        totalItemPrice: (item.unitPrice * item.count).toFixed(2),
      }))
    );
  }, [orders]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "orderId",
        header: "Order ID",
        size: 10,
        Cell: ({ row }) => row.index + 1, 
      },
      {
        accessorKey: "userName",
        header: "Customer",
        size: 100,
      },
      {
        accessorKey: "productImage",
        header: "Product Image",
        size: 80,
        Cell: ({ cell }) =>
          cell.getValue() ? (
            <Avatar
              src={cell.getValue()}
              variant="rounded"
              sx={{ width: 60, height: 60 }}
            />
          ) : (
            "No Image"
          ),
      },
      {
        accessorKey: "productName",
        header: "Product",
        size: 100,
      },
      {
        accessorKey: "unitPrice",
        header: "Unit Price",
        size: 90,
      },
      {
        accessorKey: "count",
        header: "Quantity",
        size: 90,
      },
      {
        accessorKey: "totalItemPrice",
        header: "Total Item Price",
        size: 110,
      },
      {
        accessorKey: "feedback",
        header: "Feedback",
        size: 190,
      },
      {
        accessorKey: "rating",
        header: "Rating",
        size: 60,
      },
      {
        accessorKey: "orderDate",
        header: "Order Date",
        size: 100,
      },
    ],
    []
  );

  return (
    <Box sx={{ width: "95%", margin: "auto" }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
        Orders & Feedback Table
      </Typography>
      <MaterialReactTable
        columns={columns}
        data={tableData}
        enableRowVirtualization
        muiTableBodyProps={{
          sx: {
            height: "600px",
            overflowY: "auto",
          },
        }}
        state={{ isLoading: loading }}
      />
    </Box>
  );
};

export default FeedbackTable;
