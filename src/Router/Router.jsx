import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home/Home/Home";
import RootLayout from "../RootLayout/RootLayout";
import AuthLayout from "../AuthLayout/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import About from "../Pages/About/About";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import Coverage from "../Pages/Coverage/Coverage";
import Loading from "../Loading/Loading";

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
          <PrivateRoute>
            <Coverage />
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
]);
