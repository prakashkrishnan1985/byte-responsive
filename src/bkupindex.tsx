import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { MyProvider } from "./providers/MyContext";
import "../src/components/ui/styles/fonts.scss";
import "./index.css";
import { MyWidgetProvider } from "./providers/WidgetsProvider";
import { FlowDataProvider } from "./providers/FlowDataProvider";
// import AuthProvider from "./providers/AuthProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <MyProvider>
      <MyWidgetProvider>
      <FlowDataProvider>
        <App />
      </FlowDataProvider>
      </MyWidgetProvider>
    </MyProvider>
  </BrowserRouter>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
