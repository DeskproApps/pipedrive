import { Routes, Route, useLocation } from "react-router-dom";
import { Contacts } from "./pages/Contact";
import { Main } from "./pages/Main";
import { DealDetails } from "./pages/DealDetails";
import { CreateDeal } from "./pages/CreateDeal";
import { CreateActivity } from "./pages/CreateActivity";
import { CreateNote } from "./pages/CreateNote";
import { EditDeal } from "./pages/EditDeal";
import { EditContact } from "./pages/EditContact";
import { Redirect } from "./pages/Redirect";
import { VerifySettings } from "./pages/VerifySettings";
import { AppContainer } from "./components/common";

const App = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.includes("/admin/");

  return (
    <AppContainer isAdmin={isAdmin}>
      <Routes>
        <Route index path="/" element={<Main/>}/>
        <Route path="/dealdetails/:dealId" element={<DealDetails/>}/>
        <Route path="/contacts" element={<Contacts/>}/>
        <Route path="/redirect/" element={<Redirect/>}/>
        <Route path="/createdeal" element={<CreateDeal/>}/>
        <Route path="/editdeal/:dealId" element={<EditDeal/>}/>
        <Route path="/createactivity" element={<CreateActivity/>}/>
        <Route path="/createnote" element={<CreateNote/>}/>
        <Route path="/editcontact/:contactId" element={<EditContact/>}/>
        <Route path="/admin/verify_settings" element={<VerifySettings/>}/>
      </Routes>
    </AppContainer>
  );
};

export { App };
