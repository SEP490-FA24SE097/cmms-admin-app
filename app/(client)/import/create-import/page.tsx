"use client";
import CreateImport from "@/components/import/create-import";
import ManagerHeader from "@/components/manager/header/page";
import NavHeader from "@/components/manager/nav-header/page";
import { MaterialProvider } from "@/context/import-context";

export default function CreateImportPage() {
  return (
    <MaterialProvider>
      <div className="bg-slate-100 h-screen flex flex-col">
        <ManagerHeader />
        <NavHeader />
        <div className="flex-1 h-full ">
          <CreateImport />
        </div>
      </div>
    </MaterialProvider>
  );
}
