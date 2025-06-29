import React from "react";

const BenefitItem = ({ title, description, image }) => {
  return (
    <div className="flex items-start gap-4 my-10 px-5 shadow-xl rounded-2xl p-4">
      <img src={image} alt={title} className="w-16 h-16 object-contain" />
      <div className="ml-4 border-l pl-6 border-dashed border-gray-600">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default BenefitItem;
