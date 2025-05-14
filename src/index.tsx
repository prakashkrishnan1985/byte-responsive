import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { MyProvider } from "./providers/MyContext";
import "../src/components/ui/styles/fonts.scss";
import "./index.css";
import { MyWidgetProvider } from "./providers/WidgetsProvider";
import { FlowDataProvider } from "./providers/FlowDataProvider";
import { OrchestrationProvider } from "./providers/OrchestrationProvider";
import { Provider } from "react-redux";
import store, { persistor } from "./store/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Box, CircularProgress } from "@mui/material";

// import AuthProvider from "./providers/AuthProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <MyProvider>
            <MyWidgetProvider>
              <FlowDataProvider>
                <Suspense fallback={ <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minHeight: "100vh",
                        }}
                      >
                        <CircularProgress />
                      </Box>}>
                <OrchestrationProvider>
                  <App />
                </OrchestrationProvider>
                </Suspense>
              </FlowDataProvider>
            </MyWidgetProvider>
          </MyProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
