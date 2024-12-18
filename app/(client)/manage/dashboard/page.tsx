"use client";
import ManagerHeader from "@/components/manager/header/page";
import NavHeader from "@/components/manager/nav-header/page";
import { useGetDashboard } from "@/lib/actions/dashboard/query/dashboard-query";
import React, { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { RiHandCoinFill } from "react-icons/ri";

interface MonthlyRevenue {
  month: number;
  storeId: string;
  storeName: string;
  totalInvoices: number;
  totalRevenue: number;
  totalRefunds: number;
  profit: number;
}
import { useSession } from "next-auth/react";
import { useRouter } from "nextjs-toploader/app";
import { useRole } from "@/providers/role-context";
export default function StoreDashboard() {
  const router = useRouter();
  const { role } = useRole();
  const { data: session } = useSession();
  useEffect(() => {
    // Redirect to login if session.user is not available
    if (!session?.user) {
      router.push("/login");
      return;
    }

    // Redirect to /auth for invalid roles
    if (role && role === "Senior_Management") {
      router.push("/unauthorized");
    }
  }, [session, role, router]);
  const [dashboardData, setDashboardData] = useState<MonthlyRevenue[]>([]);
  const [dashboardQueryParams, setDashboardQueryParams] = useState({
    Year: 2024,
  });

  const {
    data: dashboardDataResponse,
    isLoading,
    error,
  } = useGetDashboard(dashboardQueryParams);

  useEffect(() => {
    if (dashboardDataResponse?.data) {
      setDashboardData(dashboardDataResponse.data);
    }
  }, [dashboardDataResponse]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!dashboardData.length) return <div>No data available</div>;

  const groupedData = dashboardData.reduce((acc, store) => {
    const {
      storeId,
      storeName,
      month,
      totalRevenue,
      totalRefunds,
      profit,
      totalInvoices,
    } = store;
    if (!acc[storeId]) {
      acc[storeId] = {
        storeId,
        storeName,
        totalInvoices: 0, // Khởi tạo tổng số đơn hàng
        totalRevenue: 0, // Khởi tạo tổng doanh thu
        totalRefunds: 0, // Khởi tạo tổng hoàn tiền
        profit: 0, // Khởi tạo tổng lợi nhuận
        data: [],
      };
    }
    acc[storeId].data.push({
      month,
      totalRevenue,
      totalRefunds,
      totalInvoices,
      profit,
    });
    // Cộng dồn các giá trị
    acc[storeId].totalInvoices += totalInvoices;
    acc[storeId].totalRevenue += totalRevenue;
    acc[storeId].totalRefunds += totalRefunds;
    acc[storeId].profit += profit;
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="h-[100vh] grid grid-cols-1 grid-rows-10 gap-4">
      <div>
        <ManagerHeader />
        <NavHeader />
      </div>
      <div className="row-span-9 mt-3 w-[80%] mx-auto">
        <h1 className="text-center font-bold">DOANH THU CỦA TỪNG CỬA HÀNG</h1>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ marginRight: "10px" }}>Chọn năm:</label>
          <select
            value={dashboardQueryParams.Year}
            onChange={(e) =>
              setDashboardQueryParams({ Year: Number(e.target.value) })
            }
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value={2023}>2023</option>
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>

        {Object.values(groupedData).map((store) => (
          <div
            key={store.storeId}
            style={{
              marginBottom: "2rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "20px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3 className="text-center font-bold">{store.storeName}</h3>
            <div className="flex">
              <FaFileInvoiceDollar className="size-7 mr-3" />
              {store.totalInvoices} đơn hàng
            </div>
            <div className="flex">
              <RiHandCoinFill className="size-7 mr-3" />
              {store.totalRevenue}vnđ doanh thu
            </div>
            {/* Biểu đồ */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={store.data}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalRevenue" fill="#8884d8" name="Doanh thu" />
                <Bar dataKey="totalRefunds" fill="#82ca9d" name="Hoàn tiền" />
                <Bar dataKey="profit" fill="#ffc658" name="Lợi nhuận" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
