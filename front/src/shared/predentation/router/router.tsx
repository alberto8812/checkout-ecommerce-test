import { createBrowserRouter, Navigate } from "react-router-dom";
import { PageError } from "../handkeErrors/PageError";
import { Root } from "./Root";
import { lazy, Suspense } from "react";
import { DashboardLayout } from "../layouts/DashBoardLayout";
import LoadingPage from "../../../components/loadings/LoadingPage";
//aplicar lazy loading a las rutas del dashboard
const ProductPage = lazy(() =>
  import("@/modules/product/presentation/ProductPage").then((module) => ({
    default: module.ProductPage,
  })),
);
const CheckoutPage = lazy(() =>
  import("@/modules/checkout/presentation/CheckoutPage").then((module) => ({
    default: module.CheckoutPage,
  })),
);
const SummarydetailPage = lazy(() =>
  import("@/modules/summarydetail/presentation/Summarydetail.page").then(
    (module) => ({
      default: module.SummarydetailPage,
    }),
  ),
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
            index: true,
            element: <Navigate to="product" replace />,
          },
          {
            path: "product",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <ProductPage />
              </Suspense>
            ),
          },
          {
            path: "checkout",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <CheckoutPage />
              </Suspense>
            ),
          },
          {
            path: "summary",
            element: (
              <Suspense fallback={<LoadingPage />}>
                <SummarydetailPage />
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
        element: <PageError />,
      },
    ],
  },
]);
