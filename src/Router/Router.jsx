import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home/Home/Home";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import About from "../Pages/About/About";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import Coverage from "../Pages/Coverage/Coverage";
import Loading from "../Loading/Loading";
import SendPercel from "../Pages/SendPercel/SendPercel";
import DashboardLayout from "../Layouts/DashboardLayout/DashboardLayout";
import MyParcels from "../Pages/Dashboard/MyParcels/MyParcels";
import RootLayout from "../Layouts/RootLayout/RootLayout";
import AuthLayout from "../Layouts/AuthLayout/AuthLayout";
import Payment from "../Pages/Dashboard/MyParcels/Payment/payment";
import PaymentHistory from "../Layouts/DashboardLayout/PaymentHistory/PaymentHistory";
import TrackParcel from "../Pages/Dashboard/TrackParcel/TrackParcel";
import BeARider from "../Pages/BeARider/BeARider";
import ActiveRiders from "../Pages/Dashboard/ActiveRiders/ActiveRiders";
import PendingRiders from "../Pages/Dashboard/PendingRiders/PendingRiders";
import MakeAdmin from "../Pages/Dashboard/MakeAdmin/MakeAdmin";
import ForbidenPage from "../Pages/ErrorPage/ForbiddenPage/ForbidenPage";
import AdminRoute from "../PrivateRoute/AdminRoute";
import AssignRider from "../Pages/Dashboard/AssignRider/AssignRider";
import RiderRoute from "../PrivateRoute/RiderRoute";
import PendingDeliveries from "../Pages/Dashboard/PendingDeliveries/PendingDeliveries";
import CompleteDeliveries from "../Pages/Dashboard/CompletedDeliveries/CompleteDeliveries";
import MyEarnings from "../Pages/Dashboard/MyEarnings/MyEarnings";
import DashboardHome from "../Pages/Dashboard/DashboardHome/DashboardHome";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    hydrateFallbackElement: <Loading />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/about",
        element: (
          <PrivateRoute>
            <About />
          </PrivateRoute>
        ),
      },
      {
        path: "/coverage",
        loader: () => fetch("./serviceCenter.json"),
        element: (
          <>
            <Coverage />
          </>
        ),
      },
      {
        path: "/sendParcel",
        loader: () => fetch("./serviceCenter.json"),
        element: (
          <PrivateRoute>
            <SendPercel />
          </PrivateRoute>
        ),
      },
      {
        path: "/be-rider",
        loader: () => fetch("./serviceCenter.json"),

        element: (
          <PrivateRoute>
            <BeARider />
          </PrivateRoute>
        ),
      },
      {
        path: "forbidden",
        element: <ForbidenPage />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "myParcels",
        element: <MyParcels />,
      },
      {
        path: "payment/:parcelId",
        element: <Payment />,
      },
      {
        path: "payment-history",
        element: <PaymentHistory />,
      },
      {
        path: "track",
        element: <TrackParcel />,
      },
      // rider route only

      {
        path: "pending-deliveries",
        element: (
          <RiderRoute>
            <PendingDeliveries />
          </RiderRoute>
        ),
      },
      {
        path: "completed-deliveries",
        element: (
          <RiderRoute>
            <CompleteDeliveries />
          </RiderRoute>
        ),
      },
      {
        path: "my-earning",
        element: (
          <RiderRoute>
            <MyEarnings />
          </RiderRoute>
        ),
      },
      //admin route only
      {
        path: "assign-riders",
        element: (
          <AdminRoute>
            <AssignRider />
          </AdminRoute>
        ),
      },
      {
        path: "active-riders",
        element: (
          <AdminRoute>
            <ActiveRiders />
          </AdminRoute>
        ),
      },
      {
        path: "pending-riders",
        element: (
          <AdminRoute>
            <PendingRiders />
          </AdminRoute>
        ),
      },
      {
        path: "make-admin",
        element: (
          <AdminRoute>
            <MakeAdmin />
          </AdminRoute>
        ),
      },
    ],
  },
]);
