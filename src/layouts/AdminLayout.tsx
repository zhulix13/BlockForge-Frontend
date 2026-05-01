import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../components/ui/AdminSidebar";
import { AdminTopBar } from "../components/ui/AdminTopBar";
import ToastContainer from "../components/toast/ToastContainer";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen min-h-dvh bg-[#09090b]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar />

        {/* Page content with dot-grid bg */}
        <main className="flex-1 overflow-y-auto bg-dotgrid">
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
