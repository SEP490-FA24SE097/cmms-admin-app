import ImportList from "@/components/import/list-import";
import ManagerHeader from "@/components/manager/header/page";
import NavHeader from "@/components/manager/nav-header/page";

export default function ImportPage() {
  return (
    <div className="bg-slate-100 h-screen">
      <ManagerHeader />
      <NavHeader />
      <ImportList />
    </div>
  );
}
