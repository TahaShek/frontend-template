import App from "@/App";
import dash from "../pages/dash";
import { createBrowserRouter, RouterProvider } from "react-router";
import React from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/dash",
    element: React.createElement(dash),
  },
]);


export const AppRoutes =()=>{
    return <RouterProvider router={router}></RouterProvider>
}