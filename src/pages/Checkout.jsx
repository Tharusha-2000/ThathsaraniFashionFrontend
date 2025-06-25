import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { clearCart } from "../redux/reducers/cartSlice";
import { openSnackbar } from "../redux/reducers/SnackbarSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  
} from "@stripe/react-stripe-js";
import{
  getClientSecret,
  deleteFromCart,
  updatePaymentState,
} from "../api";
import axios from "axios";

import bgImg from "../utils/Images/Header.png";


const stripePromise = loadStripe(
  "pk_test_51QLb3dCtgNr9CP7sSpK2xhyHNZ9GXIdaX90sOFF67neyqDekhdG201u6vuEDdFjoNr13TqlXN7B7YvylE0rA0cty00Ch4ol5nw"
);

import { useDispatch, useSelector } from "react-redux";

const total = Math.round(1000 * 0.3458 * 100);

const PaymentForm = (props) => {
  const [cardHolderName, setCardHolderName] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const history = useNavigate();
  const navigate = useNavigate();

  const cartIds = props.cartIds;

  const [paymentId, setPaymentId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  const handleCardHolderNameChange = (event) => {
    setCardHolderName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) {
      console.error("Card Number Element not found");
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      props.clientSecret,
      {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: cardHolderName,
          },
        },
      }
    );

    if (error) {
      console.error(error);
      dispatch(
        openSnackbar({
          message: "Payment unsuccessful",
          severity: "error",
        })
      );
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      console.log("Payment succeeded!", paymentIntent);

      updatePaymentState(props.OrderId);

      for (let i = 0; i < cartIds.length; i++) {
        console.log(cartIds[i]);
        await deleteFromCart(cartIds[i]);
      
      }

      dispatch(clearCart());

      dispatch(
        openSnackbar({
          message: "Payment successful",
          severity: "success",
        })
      );

      // Set the paymentId state here
      setPaymentId(paymentIntent.id);

      setTimeout(() => {
        navigate("/orders");
      //  window.location.reload(); // Reload the orders page
      }, 3000);
    }
  };
  const CARD_ELEMENT_OPTIONS1 = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "20px",
        "::placeholder": {
          color: "#aab7c4",
        },
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "4px",
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
    placeholder: "45** **** **** 3947",
  };
  const CARD_ELEMENT_OPTIONS2 = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "20px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
    placeholder: "MM/YY",
  };
  const CARD_ELEMENT_OPTIONS3 = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "20px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
    placeholder: "CVC",
  };
  const inputStyle = {
    border: "none",
    outline: "none",
    paddingBottom: "20px",
    marginecolor: "none",
    fontSize: "20px",
    color: "#32325d",
    fontFamily: "Arial, sans-serif",
    "::placeholder": {
      color: "#aab7c4",
    },
  };

  const buttonStyle = {
    backgroundColor: "rgb(255,199,0)",
    color: "white", // Optionally change text color to ensure readability
    border: "none",
    width: "75%",
    height: "60%",
  };
  const wrapperStyle = {
    padding: "0.3%",
    border: "1px solid #ccc",
    borderRadius: "6px",
    marginBottom: "1%",
    width: "100%",
    alignItems: "center",
  };

  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <div className="container-fluid" style={{ height: "100vh" }}>
      <div className="row" style={{ height: "100%" }}>
        <div className="col-md-6 d-flex align-items-center justify-content-center k-20">
          <form onSubmit={handleSubmit} className="p-5 shadow w-100 mx-5">
            <div style={wrapperStyle}>
              <input
                type="text"
                style={{ ...inputStyle }}
                value={cardHolderName}
                onChange={handleCardHolderNameChange}
                placeholder="John Doe"
              />
            </div>
            <div style={wrapperStyle}>
              <CardNumberElement options={CARD_ELEMENT_OPTIONS1} />
              <br />
            </div>
            <div style={wrapperStyle}>
              <CardExpiryElement options={CARD_ELEMENT_OPTIONS2} />
              <br />
            </div>
            <div style={wrapperStyle}>
              <CardCvcElement options={CARD_ELEMENT_OPTIONS3} />
              <br />
            </div>

            {/* <div className="form-check form-switch">
                  <label
                    className="form-check-label ml-0"
                    htmlFor="flexSwitchCheckDefault"
                  >
                    SET AS DEFAULT
                  </label>
                  <input
                    className="form-check-input ml-3"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                  />
                </div> */}
            <div className="form-check form-check-inline">
              <input
                className="form-check-input mt-2"
                type="checkbox"
                id="inlineCheckbox1"
                value="option1"
              />
              <label
                className="form-check-label ml-2"
                htmlFor="inlineCheckbox1"
                style={{ fontStyle: "italic", fontSize: "12px" }}
              >
                By Continuing your agree to our{" "}
                <a href="#" data-bs-toggle="modal" data-bs-target="#termsModal">
                  Terms and Conditions.
                </a>
              </label>
            </div>
            {/* Modal */}
            <div
              className="modal fade"
              id="termsModal"
              tabIndex={-1}
              aria-labelledby="termsModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="termsModalLabel">
                      Terms and Conditions
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
          
                  </div>
                </div>
              </div>
            </div>
            {/* Modal */}
            <div className="d-grid">
              <button
                className="btn mt-5"
                type="submit"
                style={{...buttonStyle, width: "100%", background:"red"}}
                disabled={!stripe}
              >
                Pay Now
              </button>
              {/* <button className="btn mt-5" type="button" style={buttonStyle}   onClick={() => history("/payment3",{state:{userId,tripId}})} >Pay Now</button> */}
            </div>
          </form>
        </div>

        <div
          className="col-6"
          style={{
            backgroundImage: `url(${bgImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
          }}
        ></div>
      </div>
    </div>
  );
};

const Checkout = (prop1) => {
  const { currentUser } = useSelector((state) => state.user);

  const location = useLocation();
  const { totalAmount } = location.state || {};
  const { cartIds } = location.state || {};
  const { orderId } = location.state || {};

  const LkrValue = parseInt(totalAmount, 10);
  const usdValue = LkrValue / 296.75;
  console.log(usdValue);

  const [clientSecret, setClientSecret] = useState(null);
  const total1 = prop1.totalPaymentAmount;
  React.useEffect(() => {
      const fetchClientSecret = async () => {
        try{
          const response = await getClientSecret({amount : LkrValue, currency: "usd", paymentMethodTypes: ["card"]});
          if(response && response.data){
            setClientSecret(response.data.clientSecret);
            console.log(response.data.clientSecret);
          }else{
            console.log("Error fetching client secret");
          }
        }
        catch(error){
          console.log("Error fetching client secret", error);
      }
    };
    fetchClientSecret();
  }, []);

  return (
    <Elements stripe={stripePromise}>
      {clientSecret && (
        <PaymentForm
          clientSecret={clientSecret}
          OrderId={orderId}
          cartIds={cartIds}
        />
      )}
    </Elements>
  );
};

export default Checkout;