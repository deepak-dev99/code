import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistor, store } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ThemeProvider from "./components/ThemeProvider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      {/* <PersistGate loading={<div>Loading...</div>} persistor={persistor}> */}
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
        
      {/* </PersistGate> */}
    </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);