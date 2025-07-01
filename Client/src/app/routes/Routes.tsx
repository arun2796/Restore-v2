import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";

import Catalog from "../../features/catalog/Catalog";

import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPages from "../../features/about/AboutPages";
import ContactPages from "../../features/contact/ContactPages";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/basket/BasketPage";
import CheckOutPage from "../../features/checkout/checkOutPages";
import LoginForm from "../../features/account/loginForm";
import RegisterForm from "../../features/account/registerForm";
import RequiredAuth from "./RequiredAuth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RequiredAuth />,
        children: [{ path: "/checkout", element: <CheckOutPage /> }],
      },
      { path: "", element: <HomePage /> },
      { path: "/catalog", element: <Catalog /> },
      { path: "/catalog/:id", element: <ProductDetails /> },
      { path: "/about", element: <AboutPages /> },
      { path: "/contact", element: <ContactPages /> },
      { path: "/basket", element: <BasketPage /> },
      { path: "/server-error", element: <ServerError /> },
      { path: "/not-found", element: <NotFound /> },
      { path: "/login", element: <LoginForm /> },
      { path: "/register", element: <RegisterForm /> },
      { path: "/checkout", element: <CheckOutPage /> },
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
]);
