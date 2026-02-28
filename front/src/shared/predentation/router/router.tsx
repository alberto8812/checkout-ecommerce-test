import { createBrowserRouter } from "react-router-dom";
import { PageError } from "../handkeErrors/PageError";
import { Root } from "./Root";

import { lazy, Suspense } from "react";
import { DashboardLayout } from "../layouts/DashBoardLayout";
import LoadingPage from "../../../components/loadings/LoadingPage";
//aplicar lazy loading a las rutas del dashboard
const ProductPage = lazy(
  () => import("../../../modules/product/presentation/ProductPage"),
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      /// Dashboard Routes
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            path: "product",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <ProductPage />
              </Suspense>
            ),
          },
        ],
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
