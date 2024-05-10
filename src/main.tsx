import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { DeskproAppProvider } from "@deskpro/app-sdk";
import { UserContextProvider } from "./context/userContext";
import { ErrorFallback } from "./components/ErrorFallback";
import { App } from "./App";

import "iframe-resizer/js/iframeResizer.contentWindow.js";
import "flatpickr/dist/themes/light.css";
import "tippy.js/dist/tippy.css";
import "simplebar/dist/simplebar.min.css";
import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";

TimeAgo.addDefaultLocale(en);

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
root.render((
    <React.StrictMode>
        <HashRouter>
            <DeskproAppProvider>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <UserContextProvider>
                        <App />
                    </UserContextProvider>
                </ErrorBoundary>
            </DeskproAppProvider>
        </HashRouter>
    </React.StrictMode>
));
