"use client";

import ManagerHeader from "@/components/manager/header/page";
import NavHeader from "@/components/manager/nav-header/page";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function ManagerLayout({ children }: LayoutProps) {
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
      <main>{children}</main>
    </div>
  );
}
