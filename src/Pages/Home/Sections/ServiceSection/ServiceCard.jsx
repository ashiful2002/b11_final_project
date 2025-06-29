// components/ServiceCard.jsx
import React from "react";

const ServiceCard = ({ service }) => {
  const { icon, title, description } = service;
  return (
    <div className="card bg-base-200 hover:bg-[#d5f068] shadow-md hover:cursor-pointer hover:shadow-lg transition duration-300 p-6">
      <div className="flex flex-col items-center text-center">
        <div className="text-4xl text-primary mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
