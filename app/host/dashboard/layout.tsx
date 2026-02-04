import type { Metadata } from "next";
import { toast, Toaster } from "sonner";
import DashboardSidebar from "./DashbiardSidebar";

export const metadata: Metadata = {
  title: "Host Dashboard | BeatVote",
  description: "Manage your music room",
};

export default function DashBoardLayout({
    children,
}:{
    children:React.ReactNode
}) {

  

   return (
    <div className="flex h-screen w-full bg-gray-50">
      <DashboardSidebar/>

      <main className="flex-1 overflow-hidden">
        {children}
        <Toaster position="top-center" theme="dark"/>
      </main>
    </div>
  );
}