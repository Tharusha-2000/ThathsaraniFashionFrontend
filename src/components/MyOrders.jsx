import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Swal from "sweetalert2";
import PizzaIcon from "../utils/Images/clothDeliveryicon.png";
import Button from "../components/Button";
import FeedBackModal from "./FeedbackSection/FeedBackModal";
import FeedbackForm from "./FeedbackSection/FeedbackForm";
import FeedbackList from "./FeedbackSection/FeedbackList";
import {
  fetchOrdersByUserId,
} from "../api";
import "./MyOrders.css";

const Details = styled.div`
  max-width: 160px;
  @media (max-width: 700px) {
    max-width: 60px;
  }
`;
const Protitle = styled.div`
  color: ${({ theme }) => theme.primary};
  font-size: 16px;
  font-weight: 500;
`;
const ProDesc = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Product = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 8px;
`;
const Img = styled.img`
  height: 80px;
  width: 80px;
  object-fit: cover;
  border-radius: 6px;
`;
const TableItem = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  margin: 5% auto;
  padding: 20px;
  max-width: 600px;
  border-radius: 8px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const MyOrders = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsModalOrder, setDetailsModalOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchOrdersByUserId();
        const userOrders = response.data.orders
          .filter(order => order.paymentStatus === true)
          .map((order, index) => ({
            orderDefaultId: index + 1,
            orderId: order._id ,
            cartItems: order.cartItems,
            date: new Date(order.date),
            totalPrice: order.totalPrice,
            orderStatus: order.orderStatus,
          }))
          .sort((a, b) => b.date - a.date);
        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  const handleGiveFeedback = (order) => {
    console.log("Selected Order for Feedback:", order);
    setSelectedOrder(order);
    setShowFeedbackForm(true);
    sessionStorage.setItem("OrderId", JSON.stringify(order.orderId));
    sessionStorage.setItem("UserId", JSON.stringify(userId));
  };

  const handleCloseFeedbackModal = () => {
    setShowFeedbackForm(false);
    setSelectedOrder(null);
    sessionStorage.removeItem("OrderId");
    sessionStorage.removeItem("UserId");
  };

  return (
    <>
      {loading ? (
        <div className="row p-4 rounded-4 sec shadow bg-grey mt-4 mb-4 ml-4 mr-4">
          <div className="col-lg-12 mt-5 mb-4">
            <p className="text-center">Loading...</p>
          </div>
        </div>
      ) : orders.length > 0 ? (
        orders.map(order => (
          <div key={order.orderId} className="row p-4 rounded-4 sec shadow m-4 h-auto">
            <div className="col-lg-1 d-flex align-items-center justify-content-center">
              <img src={PizzaIcon} alt="Icon" style={{ width: "50px", height: "50px" }} />
            </div>
            <div className="col-lg-3 d-grid">
              <h6>Order ID: {order.orderDefaultId}</h6>
              <p>{order.date.toLocaleDateString()}</p>
              <p>Total Price: LKR {order.totalPrice}.00</p>
            </div>
            <div className="col-lg-2 d-flex justify-content-center" >
            <Button
                text="View Details"
                type="primary"
                onClick={() => setDetailsModalOrder(order)}
              
              />
            </div>
            <div className="col-lg-2 d-grid justify-content-center" style={{ marginLeft: "70px" }}>
              <h6>Status</h6>
              <p>{order.orderStatus}</p>
            </div>
            <div className="col-lg-2 d-flex justify-content-center">
              <Button
                text="Add Review"
                type="primary"
                onClick={() => handleGiveFeedback(order)}
                isDisabled={order.orderStatus !== "Completed"}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="row p-4 rounded-4 sec shadow bg-grey mt-4 mb-4 ml-4 mr-4">
          <div className="col-lg-12 mt-5 mb-4">
            <p className="text-center">No past orders found.</p>
          </div>
        </div>
      )}
     {detailsModalOrder && (
  <ModalOverlay>
    <ModalContent>
      <CloseButton onClick={() => setDetailsModalOrder(null)}>×</CloseButton>
      <h5>Order Details - ID: {detailsModalOrder.orderDefaultId}</h5>
      <p>Date: {new Date(detailsModalOrder.date).toDateString()}</p>
      <p>Total Price: LKR {detailsModalOrder.totalPrice}</p>
      <p>Status: {detailsModalOrder.orderStatus}</p>
      <h6>Items:</h6>
      {detailsModalOrder.cartItems.map((item) => (
        <Product key={item._id}>
          <Img src={item.productId.imageUrl} alt={item.productId.name} />
          <Details>
            <Protitle>{item.productId.name}</Protitle>
            <ProDesc>Category: {item.productId.categories.join(", ")}</ProDesc>
            <ProDesc>Size: {item.clothSize}</ProDesc>
            <ProDesc>Count: {item.count}</ProDesc>
            <ProDesc>Price: LKR {item.unitPrice}</ProDesc>
          </Details>
        </Product>
      ))}
    </ModalContent>
  </ModalOverlay>
)}
      {showFeedbackForm && selectedOrder && (
        <FeedBackModal onClose={handleCloseFeedbackModal}>
          <FeedbackForm
            userId={userId}
            orderId={selectedOrder.orderId}
            onClose={handleCloseFeedbackModal}
            onSave={(feedback) => console.log("Feedback saved:", feedback)}
          />
          <FeedbackList userId={userId} orderId={selectedOrder.orderId} />
        </FeedBackModal>
      )}
    </>
  );
};

MyOrders.propTypes = {
  userId: PropTypes.number.isRequired,
};

export default MyOrders;
