import React from "react";
import b1 from "../../../../assets/benefits/b1.png";
import b2 from "../../../../assets/benefits/b2.png";
import BenefitItem from "./BenefitItems";
const benefits = [
  {
    id: 1,
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    image: b1,
  },
  {
    id: 2,
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    image: b2,
  },
  {
    id: 3,
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    image: b1,
  },
];

const BenefitsSection = () => {
  return (
    <div className="w- max-w-4xl mx-auto px-4 p-4 my-10  border rounded-2xl  border-gray-300">
      {benefits.map((benefit, index) => (
        <div key={benefit.id}>
          <BenefitItem {...benefit} />
          {index !== benefits.length - 1 && (
            <div className="shadow-2xl  border border-dotted border-gray-300"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BenefitsSection;
