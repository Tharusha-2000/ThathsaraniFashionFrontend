import axios from "axios";


const API = axios.create({
  baseURL: "http://localhost:7000/api/users/",
});

export const UserSignIn = async (data) => {
  return await API.post(`login`, data);
}
export const UserSignUp = async (data) =>{
  console.log('Data being sent to API:', data);
  const response= await API.post(`register`, data);
  console.log('Response from API:', response);
  return response;
}


export const SendEmail = async (data) =>
  await API.post(`generateOTP&sendmail`, data);


export const verifyOTP = async (otp) => {
  const response = await API.get(`verifyOTP?&code=${otp}`);
  return response;
  
}; 

export const PasswordChange = async (data) =>
  await API.put(`resetPassword`, data);

export const UserCreate = async (data) => {
  const response = await API.post(`User`, data);
  return response;
};


export const getUserById = async () => {
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await API.get(`user`, config);
  return response.data;
};

export const updateUser = async (data) => {
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await API.put(`updateuser`, data, config);
  return response;
};

//products
export const getAllProducts = async (filter) =>
  await API.get(`products?${filter}`);

export const getProductDetails = async (id) =>
  await API.get(`product/${id}`);



export const createProduct = async (productData) => {
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return await API.post("product/", productData, config);
};



export const updateProduct = async (id, productData) => {
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  console.log("Product Data:", productData);
  return await API.put(
    `product/${id}`,
    productData,
    config
  );
};
export const deleteProduct = async (productId) => {
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await API.delete(`Product/${productId}`, config);
  return response;
};



export const getCartByUserId = async () => {
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await API.get(`cart`, config);
};

// export const getCart = async () => {
//   const token = localStorage.getItem("thathsarani-token");
//   console.log(token);
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };

//   return await API.get(`Cart`, config);
// };

export const addToCart = async (data) => {
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await API.post(`cart/`, data, config);
  return res;
};

export const updateFromCart = async ({ cartId, count }) => {
  const data = { count: count > 0 ? count : 0 }; // If count is <= 0, treat as removal (count = 0)
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await API.put(`cart/${cartId}`,data, config);
  console.log(response);
  return response.data;
};

export const removeCart = async (cartId) => {

  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await API.delete(`cart/${cartId}`, config);
  console.log(response);
  return response.data;
};


export const updateItemOnCart = async (data) => {
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await API.put(`Cart/${data.cartId}`, data, config);
};


export const deleteFromCart = async (cartId) => {
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await API.delete(`Cart/${cartId}`, config);
  return response.data;
};

//cart
export const getUserById2 = async (id) => {
  const response = await API.get(`User/${id}`);
  return response;
};

//Orders
export const createOrder = async (data) => {
  console.log(data);
  const token = localStorage.getItem("thathsarani-token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await API.post(`order`, data, config);
  return response;
};

export const storeOrderProduct = async (data) => {
  console.log(data);
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res= await API.post(`OrderProduct`, data, config);
  console.log(res);
  return res;
};

export const getOrders = async () => {
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await API.get(`order`, config);
};

export const handelViewOrder = async (orderId) => {
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await API.get(`OrderProduct/byOrder/${orderId}`, config);
};

export const updateOrder = async (orderId, updatedStatus) => {
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const data = {
    orderId,
    updatedStatus, 
  };
  return await API.put(`updateStatusByOrderId`, data , config);
};


export const getClientSecret = async (amount) =>{
  const res = API.post(`Payment/create-payment-intent`,amount);
  return res;
}

export const updatePaymentState = async (data) => {
    const token = localStorage.getItem("thathsarani-token");
    console.log(token);
    console.log(data);
    const payload = {
      paymentStatus: true, // Correct syntax for the request body
    };
   const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }; 
    await API.put(`byOrderId/${data}`,payload,config);
 
}

export const sendEmailToOrderOwner = async (data) => {
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  console.log(data);
 const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
}; 
  await API.put(`sendUserToEmail/${data}`,config);

}

//API for fetching product reviews
export const getProductFeedbacks = async (productId) => {
  console.log("Fetching product reviews for ID:", productId);
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      productId, 
    },
  };
  const response = await API.get(`/rating`,config);
  console.log(response);
  return response; 
};

//API for fetching Feedbacks by order Id
export const GetFeedbackByOrderId = async (orderId) => {
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await API.get(
    `/getFeedbackByOrderId/${orderId}`,
    config
  );
  return response;
};

//API fetching for add product feedback
export const SaveProductFeedback = async (newFeedback) => {
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await API.put(
    `createFeedbackByOrderId`,
    newFeedback,
    config
  );
  return response;
};

//API for feching orders by orderId
export const fetchOrdersByUserId = async () => {
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await API.get(`/getOrderById`, config);
  return response;
};

//API for fetching order included products
export const getOrderProductByOrderId = async (orderId) => {
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await API.get(`/OrderProduct/byOrder/${orderId}`, config);
  return response;
};

//API for get products by product Id
export const getProductById = async (productId) => {
  const response = await API.get(`/Product/GetProductById/${productId}`);
  return response;
};

//users-dilum
export const getAllUsers = async () => {
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await API.get(`users`, config);
};
export const deleteUser = async (id) => {
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await API.delete(`user/${id}`, config);
  return response.data;
};

//get all orders -dilum
export const getAllOrders = async () => {
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await API.get(`Order`, config);
};
//get all feedback -dilum
export const getAllFeedback = async () => {
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await API.get(`Feedback/GetAllFeedbacks`, config);
};
//get order details -dilum
export const getallOrderDetails = async (id) => {
  const token = localStorage.getItem("thathsarani-token");
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await API.get(`OrderProduct`, config);
};



