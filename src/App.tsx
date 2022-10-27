// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// Added this because the ErrorBoundary throws a TS error,
// even though it's completely acceptable.
import { DeskproAppProvider } from "@deskpro/app-sdk";
import { Routes, HashRouter, Route } from "react-router-dom";

import "flatpickr/dist/themes/light.css";
import "tippy.js/dist/tippy.css";
import "simplebar/dist/simplebar.min.css";

import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";

import { Contacts } from "./pages/Contact";
import { Main } from "./pages/Main";

import { DealDetails } from "./pages/DealDetails";
import { Redirect } from "./pages/Redirect";
import { CreateDeal } from "./pages/CreateDeal";
import { CreateActivity } from "./pages/CreateActivity";
import { CreateNote } from "./pages/CreateNote";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/ErrorFallback";
import { EditDeal } from "./pages/EditDeal";
import { EditContact } from "./pages/EditContact";

function App() {
  return (
    <DeskproAppProvider>
      <HashRouter>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Routes>
            <Route index path="/" element={<Main />}></Route>
            <Route
              path="/dealdetails/:dealId"
              element={<DealDetails />}
            ></Route>
            <Route path="/contacts" element={<Contacts />}></Route>
            <Route path="/redirect/" element={<Redirect />}></Route>
            <Route path="/createdeal" element={<CreateDeal />}></Route>
            <Route path="/editdeal/:dealId" element={<EditDeal />}></Route>
            <Route path="/createactivity" element={<CreateActivity />}></Route>
            <Route path="/createnote" element={<CreateNote />}></Route>
            <Route
              path="/editcontact/:contactId"
              element={<EditContact />}
            ></Route>
          </Routes>
        </ErrorBoundary>
      </HashRouter>
    </DeskproAppProvider>
  );
}

export default App;
