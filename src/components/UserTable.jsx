import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllUsers, deleteUser } from "../api"; // Import the API functions
import Swal from "sweetalert2"; // Import SweetAlert2

const UsersTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls the modal visibility

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        console.log("Fetched users:jbnm", response.data.users);
        setData(response.data.users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(userId);
          setData((prevData) => prevData.filter((item) => item.id !== userId));
          Swal.fire("Deleted!", "User has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire(
            "Error!",
            "Failed to delete the user. Please try again.",
            "error"
          );
        }
      }
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 50,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "fullName",
        header: "Full Name",
        size: 200,
        Cell: ({ row }) => `${row.original.fname} ${row.original.lname}`,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 250,
      },
      {
        accessorKey: "phoneNo",
        header: "Phone Number",
        size: 150,
      },
      {
        accessorKey: "address",
        header: "Address",
        size: 300,
      },
      {
        accessorKey: "actions",
        header: "Actions",
        size: 150,
        Cell: ({ row }) => (
          <Box display="flex" gap="8px">
            <IconButton
              color="error"
              size="small"
              onClick={() => handleDelete(row.original._id)}
             >
              <DeleteIcon />
            </IconButton>
          </Box>
        ),
      },
    ],
    []
  );

  return (
    <Box sx={{ width: "100%", margin: "auto" }}>
      {/* Users Table */}
      <MaterialReactTable
        columns={columns}
        data={data}
        enableRowVirtualization
        muiTableBodyProps={{
          sx: {
            height: "700px",
            overflowY: "auto",
          },
        }}
        state={{
          isLoading: loading,
        }}
      />
    </Box>
  );
};

export default UsersTable;
