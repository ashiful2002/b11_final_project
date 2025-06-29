import React from "react";
import Marquee from "react-fast-marquee";
import client1 from "../../../../assets/brands/amazon_vector.png";
import client2 from "../../../../assets/brands/amazon.png";
import client3 from "../../../../assets/brands/casio.png";
import client4 from "../../../../assets/brands/moonstar.png";
import client5 from "../../../../assets/brands/randstad.png";
import client6 from "../../../../assets/brands/start.png";
import client7 from "../../../../assets/brands/start-people1.png";

const logos = [client1, client2, client3, client4, client5, client6, client7];

const ClientSlider = () => {
  return (
    <section className="py-10 bg-base-100">
      <h2 className="text-center text-2xl font-bold mb-6">Our Clients</h2>
      <Marquee gradient={false} speed={40} pauseOnHover={true}>
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Client ${index + 1}`}
            className="h-6 mx-8 object-contain"
          />
        ))}
      </Marquee>
    </section>
  );
};

export default ClientSlider;

// ClientSlider
