import { createBrowserRouter } from "react-router-dom";
import { PageError } from "../handkeErrors/PageError";
import { Root } from "./Root";
import { DashboardLayout } from "../layouts/DashBoardLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      /// Dashboard Routes
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [],
      },
      {
        path: "404",
        element: <PageError />,
      },
      {
        path: "*",
        element: <DashboardLayout />,
      },
    ],
  },
]);
