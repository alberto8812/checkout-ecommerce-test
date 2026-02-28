import { RouterProvider } from "react-router-dom";
import { router } from "./shared/predentation/router/router";
import { Provider } from "react-redux";
import { store } from "./shared/predentation/stores/redux.global.store";
function App() {
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </>
  );
}

export default App;
