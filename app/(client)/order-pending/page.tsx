import ManagerHeader from "@/components/manager/header/page";
import NavHeader from "@/components/manager/nav-header/page";
import OrderPending from "@/components/order-pending/list-pending";

export default function ImportPage() {
  return (
    <div className="bg-slate-200 min-h-screen pb-5">
      <ManagerHeader />
      <NavHeader />
      <OrderPending />
    </div>
  );
}
