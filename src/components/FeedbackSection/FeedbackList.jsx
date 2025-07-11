import React, { useState, useEffect } from "react";
import axios from "axios";
import FeedbackItem from "./FeedbackItem";
import "./Style.css";
import PropTypes from "prop-types";
import { GetFeedbackByOrderId } from "../../api";

const FeedbackList = ({ userId, orderId }) => {
  const [feedback, setFeedback] = useState([]);
  const [data, setData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching feedback with params:", { userId, orderId });

        const response = await  GetFeedbackByOrderId(orderId);

        console.log("API response:", response.data);
        const feedbackArray = response.data.feedback.feedback.$values || [response.data.feedback.feedback];
        setFeedback(feedbackArray);
        setData(response.data.feedback);
        console.log("Fetched feedback:", feedbackArray);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    if (userId && orderId) {
      fetchData();
    }
  }, [userId, orderId]);

 

  return (
    <div className="feedback-list rounded-2">
      {feedback.length === 0 ? (
        <p className="text-center pt-2">No Feedback Yet from you.</p>
      ) : (
       
          <FeedbackItem item={data} /> 
        
      )}
    </div>
  );
};

FeedbackList.propTypes = {
  userId: PropTypes.number.isRequired,
  orderId: PropTypes.number.isRequired,
};

export default FeedbackList;