"use client";

import ManagerHeader from "@/components/manager/header/page";
import NavHeader from "@/components/manager/nav-header/page";
import ListMaterialsInStore from "@/components/store-material/list-materials";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StoreMaterialPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
    }
  }, [session, router]);

  if (!session?.user) {
    return null; // Prevent rendering until the user is verified
  }

  return (
    <div className="bg-slate-200 min-h-screen pb-5">
      <ManagerHeader />
      <NavHeader />
      <ListMaterialsInStore />
    </div>
  );
}
