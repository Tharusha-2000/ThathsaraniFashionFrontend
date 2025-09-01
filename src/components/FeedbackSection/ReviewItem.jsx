import React from "react";
import PropTypes from "prop-types";
import profileIcon from "../../utils/Images/ProfileIconRed.png";
import { CircularProgress, IconButton, Rating } from "@mui/material";
import "./Style.css";

const ReviewItem = ({ item }) => {
  if (!item.feedback ||item.feedback.trim() === "" || item.feedback.trim() === "0") {
    return null; // Do not render anything if feedback is invalid
  }
  return (
    <div className="Card col-md-7 p-3 justify-content-left align-items-left ">
      <div className="reviewItem h-auto">
        <div className="d-flex mt-0 pt-0">
          <img className="ProfileIcon" src={profileIcon} alt="profile" />
          <div className="Username mt-auto mb-auto fw-bold ps-3">
            {item.userId.fname} {item.userId.lname}
          </div>

          <div className="rate mt-auto mb-auto me-2 ms-auto">
            <Rating value={item.rating} />
          </div>
        </div>

        <div className="text-display justify-content-left align-items-left d-flex ms-5 ps-3">
          {item.feedback}
        </div>
        <div className="text-display justify-content-end align-items-right d-flex ms-auto me-2">
        {item.updatedAt ? new Date(item.updatedAt).toISOString().split('T')[0] : 'Invalid Date'}
        </div>
      </div>
    </div>
  );
};

ReviewItem.propTypes = {
  item: PropTypes.shape({
    fname: PropTypes.string.isRequired,
    lname: PropTypes.string.isRequired,
    feedback: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    updatedAt: PropTypes.string.isRequired,
  }).isRequired,
};
export default ReviewItem;
