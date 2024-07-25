import React from "react";

const Card = ({ image, title, date, location, price, description }) => {
    // COnvert Unix time to human time
  let dateN = new Date(date * 1000);
  return (
    <div className="retreatCard">
      <img src={image} alt={title} className="retreatCardImage"></img>
      <span className="subheading">{title}</span>
      <span>{description}</span>
      <span>Date: {dateN.toLocaleDateString()}</span>
      <span>Location: {location}</span>
      <span className="boldMobile">Price: {`$${price}`}</span>
    </div>
  );
};

export default Card;
