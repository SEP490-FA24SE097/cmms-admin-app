import ImportList from "@/components/import/list-import";
import ManagerHeader from "@/components/manager/header/page";
import NavHeader from "@/components/manager/nav-header/page";

export default function ImportPage() {
  return (
    <div className="bg-slate-200 min-h-screen pb-5">
      <ManagerHeader />
      <NavHeader />
      <ImportList />
    </div>
  );
}
