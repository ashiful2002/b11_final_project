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
        path: "myParcels",
        element: <MyParcels />,
      },
    ],
  },
]);
