import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    fetchCartRed: (state, action) => {
      state.cart = action.payload;
    },
    addToCartRed: (state, action) => {
      const item = action.payload;
      state.cart.push(item);
    },
    updateCartRed: (state, action) => {
      const item = action.payload;
      console.log("Updating cart item:", item);
      const index = state.cart.findIndex((i) => i._id == item._id);
      console.log(index);
      if (index >= 0) {
        state.cart[index] = item;
      }
    },
    removeFromCartRed: (state, action) => {
      state.cart = state.cart.filter((item) => item._id !== action.payload);

    },

    clearCart: (state) => {
      state.cart = [];  
    },

  },
});

export const { addToCartRed, updateCartRed, removeFromCartRed, fetchCartRed, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
