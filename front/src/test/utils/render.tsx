import { type ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "@/shared/predentation/stores/slices/ui.slice";
import type { RootState } from "@/shared/predentation/stores/redux.global.store";

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  preloadedState?: Partial<RootState>;
  route?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  { preloadedState, route = "/", ...renderOptions }: CustomRenderOptions = {},
) {
  const store = configureStore({
    reducer: { ui: uiReducer },
    preloadedState,
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    store,
    queryClient,
  };
}

export { screen, waitFor, within, fireEvent } from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
