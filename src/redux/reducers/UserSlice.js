import { createSlice } from "@reduxjs/toolkit";
import {jwtDecode} from 'jwt-decode';
import { act } from "react";

const initialState = {

  currentUser: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {

      state.currentUser = action.payload.user;
    },
    loginSuccess: (state, action) => {
      console.log("Payload received in loginSuccess:", action.payload);
      // state.currentUser = action.payload.user;
       console.log(action.payload.user);
       console.log(action.payload.token);
      localStorage.setItem("thathsarani-token", action.payload.token);
      console.log(action.payload.token);
      const tokenParts=action.payload.token.split('.');
      const encodedPayload=tokenParts[1];
      const decodedPayload=JSON.parse(atob(encodedPayload));
      console.log("Decoded Payload:", decodedPayload);
      // state.currentUser = jwtDecode(action.payload.jwtToken);

      state.currentUser = {
        ...decodedPayload,
        token: action.payload.token, // You might want to store the token as well
        role: decodedPayload.role,
        FirstName:decodedPayload.fname,
        id: decodedPayload.id, 
      
      };
    
      console.log("Current User:", state.currentUser);

    },
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem("thathsarani-token");
    },
  },
});

export const { updateUser, loginSuccess, logout } = userSlice.actions;

export default userSlice.reducer;
