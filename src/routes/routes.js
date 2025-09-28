import React from "react";
import { Navigate } from "react-router-dom";

// lazy load all the views
/*const Dashboard = React.lazy(() => import("../pages/dashboard/index"));
const StarterPage = React.lazy(() => import("../pages/StarterPage/index"));
const SendMessage = React.lazy(() => import("../pages/sendMessage/index"));

// auth
const Login = React.lazy(() => import("../pages/Auth/Login"));
const Logout = React.lazy(() => import("../pages/Auth/Logout"));
const ForgetPassword = React.lazy(() => import("../pages/Auth/ForgetPassword"));
const Register = React.lazy(() => import("../pages/Auth/Register"));
//const LockScreen = React.lazy(() => import("../pages/Auth/LockScreen"));*/
import Dashboard from "../pages/dashboard/index";
import StarterPage from "../pages/StarterPage/index";
import SendMessage from "../pages/sendMessage/index";

// auth
import Login from "../pages/Auth/Login";
import Logout from "../pages/Auth/Logout";
import ForgetPassword from "../pages/Auth/ForgetPassword";
import Register from "../pages/Auth/Register";


// declare all routes
const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/pages-starter", component: <StarterPage /> },
  { path: "/send", component: <SendMessage /> },

    // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forget-password", component: <ForgetPassword /> },
  { path: "/register", component: <Register /> },
  //{ path: "/lock-screen", component: <LockScreen />}
];

export { authProtectedRoutes, publicRoutes };
