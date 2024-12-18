"use client";
import ManagerHeader from "@/components/manager/header/page";
import NavHeader from "@/components/manager/nav-header/page";
import OrderPage from "@/components/shipper/invoicelist";
import { useSession } from "next-auth/react";
import { useRouter } from "nextjs-toploader/app";
import { useEffect } from "react";

export default function ShipperPage() {
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    // Redirect to login if session.user is not available
    if (!session?.user) {
      router.push("/login");
      return;
    }

    // Redirect to /auth for invalid roles
  }, [session, router]);
  return (
    <div className="min-h-screen pb-5">
      <ManagerHeader />
      <NavHeader />
      <OrderPage />
    </div>
  );
}
