// components/ServiceSection.jsx
import React from "react";
import {
  FaShippingFast,
  FaMapMarkedAlt,
  FaWarehouse,
  FaMoneyBillWave,
  FaHandshake,
  FaUndoAlt,
} from "react-icons/fa";
import ServiceCard from "./ServiceCard";

const services = [
  {
    icon: <FaShippingFast />,
    title: "Express & Standard Delivery",
    description:
      "We deliver parcels within 24–72 hours in major cities. Express delivery in Dhaka within 4–6 hours.",
  },
  {
    icon: <FaMapMarkedAlt />,
    title: "Nationwide Delivery",
    description:
      "Nationwide parcel delivery with home service in every district within 48–72 hours.",
  },
  {
    icon: <FaWarehouse />,
    title: "Fulfillment Solution",
    description:
      "Custom services with inventory management, order processing, packaging, and more.",
  },
  {
    icon: <FaMoneyBillWave />,
    title: "Cash on Home Delivery",
    description:
      "100% cash on delivery anywhere in Bangladesh with product safety guaranteed.",
  },
  {
    icon: <FaHandshake />,
    title: "Corporate Service",
    description:
      "Tailored logistics contracts including warehouse & inventory management.",
  },
  {
    icon: <FaUndoAlt />,
    title: "Parcel Return",
    description:
      "Reverse logistics for easy product returns or exchanges by customers.",
  },
];

const ServiceSection = () => {
  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Our Services
        </h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero
          hassle. From personal packages to business shipments — we deliver on
          time, every time.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              //   icon={service.icon}
              //   title={service.title}
              //   description={service.description}
              service={service}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
