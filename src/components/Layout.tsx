import type { ReactNode } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (

    <div className="flex min-h-screen">
      
      <Sidebar />

      <main className="flex-1 p-8 bg-[#F9FAFB] flex flex-col">
        <div className="w-full max-w-300 mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}