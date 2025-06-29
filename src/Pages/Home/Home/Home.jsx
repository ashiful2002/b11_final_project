import React from "react";
import Banner from "../Components/Banner/Banner";
import ServiceSection from "../Sections/ServiceSection/ServiseSection";
import ClientSlider from "../Sections/ClientSlider/ClientSlider";
import BenefitsSection from "../Sections/Benefit/Benefitsection";
import BeMearchent from "../Sections/BeMearchent/BeMearchent";

const Home = () => {
  return (
    <div className="fflex flex-col items-center justify-center ">
      <Banner />
      <ServiceSection />
      <ClientSlider />
      <BenefitsSection />
      <BeMearchent />
    </div>
  );
};

export default Home;
