import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '../components/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios'; // Ensure axios is installed
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";
import { updateUser } from "../api/index";

const UpdateProfile = ({ open, onClose, userdata, onUpdate }) => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phoneNo: '',
    address: '',
  });
  const dispatch = useDispatch();

  // Populate formData with userdata only when the dialog opens for the first time
  useEffect(() => {
    if (open && userdata && !formData.fname) {
      setFormData({
        fname: userdata.fname || '',
        lname: userdata.lname || '',
        email: userdata.email || '',
        phoneNo: userdata.phoneNo || '',
        address: userdata.address || '',
      });
    }
  }, [open, userdata]);

  // Save updated data and send it to the backend
  const handleSave = async () => {
    try {
      const response = await updateUser(formData);
      if (response.status === 200) {
        console.log('Profile updated successfully:', response.data);
        dispatch(
          openSnackbar({
            message: "Profile updated successfully",
            severity: "success",
          })
        );
        onClose();
        onUpdate([formData]);
      } else {
        console.log('Error updating profile:', response.statusText);
        dispatch(
          openSnackbar({
            message: response.statusText,
            severity: "error",
          })
        );
      }
    } catch (error) {
      console.error( error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Profile</DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          label="First Name"
          name="fname"
          value={formData.fname}
          onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
          fullWidth
        />
        <TextField
          margin="normal"
          label="Last Name"
          name="lname"
          value={formData.lname}
          onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
          fullWidth
        />
        <TextField
          margin="normal"
          label="Email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          fullWidth
        />
        <TextField
          margin="normal"
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNo}
          onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
          fullWidth
        />
        <TextField
          margin="normal"
          label="Address"
          name="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} text="Cancel" />
        <Button onClick={handleSave} text="Save" />
      </DialogActions>
    </Dialog>
  );
};

export default UpdateProfile;



