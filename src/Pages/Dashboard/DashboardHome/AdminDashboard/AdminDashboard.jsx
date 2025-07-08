import DeliveryStatusStats from "./DeliveryStatusStats";
import RechartPieChart from "./RechartPieChart/RechartPieChart";

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <DeliveryStatusStats />
      <RechartPieChart />
      {/* More widgets like total revenue, latest parcels, etc. */}
    </div>
  );
};

export default AdminDashboard;
