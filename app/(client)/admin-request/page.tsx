import ManagerHeader from "@/components/manager/header/page";
import NavHeader from "@/components/manager/nav-header/page";
import ListRequestAdmin from "@/components/request/admin/list-request";
import ListRequestStore from "@/components/request/store/list-request";

export default function StoreRequestPage() {
  return (
    <div className="bg-slate-200 min-h-screen pb-5">
      <ManagerHeader />
      <NavHeader />
      <ListRequestAdmin />
    </div>
  );
}
