import './instrument';
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { DeskproAppProvider } from "@deskpro/app-sdk";
import { UserContextProvider } from "./context/userContext";
import { ErrorFallback } from "./components/ErrorFallback";
import { App } from "./App";

import "flatpickr/dist/themes/light.css";
import "tippy.js/dist/tippy.css";
import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import "./main.css";
import "simplebar/dist/simplebar.min.css";
import { Scrollbar } from "@deskpro/deskpro-ui";
import { ErrorBoundary, reactErrorHandler } from '@sentry/react';

TimeAgo.addDefaultLocale(en);

const root = ReactDOM.createRoot(document.getElementById('root') as Element, {
  onRecoverableError: reactErrorHandler(),
});
root.render((
  <React.StrictMode>
    <Scrollbar style={{ height: "100%", width: "100%" }}>
      <HashRouter>
        <DeskproAppProvider>
          <ErrorBoundary fallback={ErrorFallback}>
            <UserContextProvider>
              <App />
            </UserContextProvider>
          </ErrorBoundary>
        </DeskproAppProvider>
      </HashRouter>
    </Scrollbar>
  </React.StrictMode>
));
