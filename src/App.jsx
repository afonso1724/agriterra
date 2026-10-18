import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import LandingPage from "@/pages/LandingPage";
import SobrePage from "@/pages/SobrePage";
import ContactosPage from "@/pages/ContactosPage";
import EntrarPage from "@/pages/EntrarPage";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminLavrasPage from "@/pages/admin/AdminLavrasPage";
import AdminClimaPage from "@/pages/admin/AdminClimaPage";
import AdminLogisticaPage from "@/pages/admin/AdminLogisticaPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sobre" element={<SobrePage />} />
        <Route path="/contactos" element={<ContactosPage />} />
        <Route path="/entrar" element={<EntrarPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="lavras" element={<AdminLavrasPage />} />
          <Route path="clima" element={<AdminClimaPage />} />
          <Route path="logistica" element={<AdminLogisticaPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  );
}
