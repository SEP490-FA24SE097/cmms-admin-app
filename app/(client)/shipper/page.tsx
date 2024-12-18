import ManagerHeader from "@/components/manager/header/page";
import NavHeader from "@/components/manager/nav-header/page";
import OrderPage from "@/components/shipper/invoicelist";

export default function ShipperPage() {
  return (
    <div className="min-h-screen pb-5">
      <ManagerHeader />
      <NavHeader />
      <OrderPage />
    </div>
  );
}
