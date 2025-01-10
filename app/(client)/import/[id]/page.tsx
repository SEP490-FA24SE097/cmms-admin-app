"use client";
import CreateImport from "@/components/import/create-import";
import UpdateImport from "@/components/import/update-import";
import ManagerHeader from "@/components/manager/header/page";
import NavHeader from "@/components/manager/nav-header/page";
import { MaterialProvider } from "@/context/import-context";
import { useRole } from "@/providers/role-context";
import { useSession } from "next-auth/react";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";

export default function UpdateImportPage() {
  const { data: session } = useSession();
  const { role } = useRole();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải ban đầu
  const [isAuthorized, setIsAuthorized] = useState(false); // Trạng thái được phép

  useEffect(() => {
    if (!session) {
      setIsLoading(false); // Session không tồn tại
      router.push("/login");
      return;
    }

    if (role) {
      if (role === "Senior_Management") {
        setIsAuthorized(true);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        router.push("/unauthorized");
      }
    }
  }, [session, role, router]);

  if (isLoading) {
    // Hiển thị trạng thái tải
    return (
      <div className="min-h-screen flex items-center justify-center">
        <iframe
          src="https://lottie.host/embed/b0b83ef8-03a3-4720-9a47-4333a87e71c2/4S8Zw18Nxp.lottie"
          className="w-48 h-48"
          title="Loading Animation"
        ></iframe>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <iframe
          src="https://lottie.host/embed/b0b83ef8-03a3-4720-9a47-4333a87e71c2/4S8Zw18Nxp.lottie"
          className="w-48 h-48"
          title="Loading Animation"
        ></iframe>
      </div>
    );
  }
  return (
    <MaterialProvider>
      <div className="bg-slate-100 h-screen flex flex-col">
        <ManagerHeader />
        <NavHeader />
        <div className="flex-1 h-full ">
          <UpdateImport />
        </div>
      </div>
    </MaterialProvider>
  );
}
