import { AdminCallback } from "@/pages/AdminCallback";
import { AppContainer } from "@/components/common";
import { Contacts } from "@/pages/Contact";
import { CreateActivity } from "@/pages/CreateActivity";
import { CreateDeal } from "@/pages/CreateDeal";
import { CreateNote } from "@/pages/CreateNote";
import { DealDetails } from "@/pages/DealDetails";
import { EditContact } from "@/pages/EditContact";
import { EditDeal } from "@/pages/EditDeal";
import { Main } from "@/pages/Main";
import { Redirect } from "@/pages/Redirect";
import { Routes, Route, useLocation } from "react-router-dom";
import { VerifySettings } from "@/pages/VerifySettings";
import LoadingPage from "@/pages/LoadingPage";
import LoginPage from "@/pages/Login";

const App = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.includes("/admin/");

  return (
    <AppContainer isAdmin={isAdmin}>
      <Routes>
        <Route index element={<LoadingPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/" element={<Main/>}/>
        <Route path="/home" element={<Main/>}/>
        <Route path="/dealdetails/:dealId" element={<DealDetails/>}/>
        <Route path="/contacts" element={<Contacts/>}/>
        <Route path="/redirect/" element={<Redirect/>}/>
        <Route path="/createdeal" element={<CreateDeal/>}/>
        <Route path="/editdeal/:dealId" element={<EditDeal/>}/>
        <Route path="/createactivity" element={<CreateActivity/>}/>
        <Route path="/createnote" element={<CreateNote/>}/>
        <Route path="/editcontact/:contactId" element={<EditContact/>}/>
        <Route path="/admin/verify_settings" element={<VerifySettings/>}/>
        <Route path="/admin/callback" element={<AdminCallback/>}/>
      </Routes>
    </AppContainer>
  );
};

export { App };
