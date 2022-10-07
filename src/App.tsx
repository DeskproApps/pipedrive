import { DeskproAppProvider } from "@deskpro/app-sdk";
import { Routes, BrowserRouter, Route } from "react-router-dom";

import "flatpickr/dist/themes/light.css";
import "tippy.js/dist/tippy.css";
import "simplebar/dist/simplebar.min.css";

import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";

import { Contacts } from "./pages/Contact";
import { Main } from "./pages/Main";

function App() {
  return (
    <DeskproAppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/contacts" element={<Contacts />}></Route>
        </Routes>
      </BrowserRouter>
    </DeskproAppProvider>
  );
}

export default App;
