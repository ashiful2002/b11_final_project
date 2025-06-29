import React from "react";
import location from "../../../../assets/location-merchant.png";

const BeMearchent = () => {
  return (
    <div
      //data-aos="zoom-in-up"
      data-aos="fade-up"
      data-aos-duration="1200"
      className=" bg-[#03373D] bg-[url(assets/be-a-merchant-bg.png)] bg-no-repeat object-cover rounded-2xl my-10 px-12"
    >
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex text-white flex-col-reverse md:flex-row items-center gap-10">
          {/* Text Section */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold leading-snug">
              Merchant and Customer Satisfaction is Our First Priority
            </h1>
            <p className="py-6 text-gray-200">
              We offer the lowest delivery charge with the highest value along
              with 100% safety of your product. Pathao courier delivers your
              parcels in every corner of Bangladesh right on time.
            </p>
          </div>

          {/* Image Section */}
          <div className="flex-1">
            <img
              src={location}
              alt="Merchant Location"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto rounded-xl shadow-lg"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button className="btn btn-primary text-black rounded-full">
            Become a Merchant
          </button>
          <button className="btn btn-primary btn-outline text-primary hover:text-black rounded-full">
            Earn with Profast Courier
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeMearchent;
