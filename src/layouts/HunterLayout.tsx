import { Outlet } from "react-router-dom";
import { HunterSidebar } from "../components/ui/HunterSidebar";
import { HunterTopBar } from "../components/ui/HunterTopBar";
import { BroadcastBanner } from "../components/ui/BroadcastBanner";
import ToastContainer from "../components/toast/ToastContainer";

export default function HunterLayout() {
  return (
    <div className="flex min-h-screen min-h-dvh bg-[#0c0a09]">
      <HunterSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <HunterTopBar />
        <BroadcastBanner />

        {/* Page content with hunter dot-grid bg */}
        <main className="flex-1 overflow-y-auto bg-dotgrid-hunter">
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
