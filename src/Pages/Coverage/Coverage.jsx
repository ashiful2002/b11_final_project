// src/pages/Coverage.jsx
import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useLoaderData } from "react-router";

// Fix icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// A small helper component to control map
const MapController = ({ position, popupRef }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 10, {
        animate: true,
        duration: 1.5, // in seconds
      });

      // Wait a bit, then open popup after animation completes
      setTimeout(() => {
        popupRef?.current?.openPopup();
      }, 1500);
    }
  }, [position]);

  return null;
};

const Coverage = () => {
  const districtData = useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const popupRefs = useRef({}); // holds refs to popups

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();

    const found = districtData.find((d) =>
      d.district.toLowerCase().includes(query)
    );

    if (found) {
      setSelectedDistrict(found);
    } else {
      alert("District not found.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-4">
        We are available in 64 districts
      </h1>

      {/* 🔍 Search Input */}
      <form onSubmit={handleSearch} className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search district..."
          className="border border-gray-300 p-2 rounded-l w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r"
        >
          Search
        </button>
      </form>

      {/* 🗺️ Map */}
      <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg border">
        <MapContainer
          center={[23.685, 90.3563]} // Center of Bangladesh
          zoom={7}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {districtData.map((item) => {
            const ref = React.createRef();
            popupRefs.current[item.district] = ref;

            return (
              <Marker
                key={item.district}
                position={[item.latitude, item.longitude]}
                ref={ref}
              >
                <Popup>
                  <div>
                    <strong>{item.district}</strong>
                    <br />
                    Status: {item.status}
                    <br />
                    Areas: {item.covered_area.join(", ")}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Pan & Zoom Controller */}
          {selectedDistrict && (
            <MapController
              position={[selectedDistrict.latitude, selectedDistrict.longitude]}
              popupRef={popupRefs.current[selectedDistrict.district]}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Coverage;
