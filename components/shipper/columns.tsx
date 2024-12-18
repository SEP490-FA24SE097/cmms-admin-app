"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IShippingDetails } from "@/lib/actions/delivery/type/delivery-type";

export const columns = (
  handleViewCustomer: (customer: IShippingDetails) => void
): ColumnDef<IShippingDetails>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Mã số",
  },
  {
    accessorKey: "address",
    header: "Địa chỉ",
  },
  {
    accessorKey: "estimatedArrival",
    header: "Ngày dự định",
    cell: ({ row }) => {
      const date = new Date(row.getValue("estimatedArrival"));
      const formated = date.toLocaleDateString();
      return <div>{formated}</div>;
    },
  },
  {
    accessorKey: "invoice.userVM.fullName",
    header: "Họ và tên",
  },
  {
    accessorKey: "invoice.invoiceStatus",
    header: "Trạng thái đơn hàng",
    cell: ({ row }) => {
      const status = row.original.invoice.invoiceStatus;

      // Define a mapping for the status codes to user-friendly labels
      const statusLabels: Record<number, string> = {
        0: "Đang chờ duyệt",
        1: "Đã duyệt",
        2: "Đang giao hàng",
        3: "Hoàn thành",
        4: "Đã hủy",
        5: "Hoàn tiền",
        6: "Không nhận hàng",
      };

      // Validation logic for special cases
      if (status === 0) {
        return (
          <span className="text-yellow-500 font-medium">
            {statusLabels[status]} (Vui lòng chờ!)
          </span>
        );
      } else if (status === 4 || status === 6) {
        return (
          <span className="text-red-500 font-medium">
            {statusLabels[status]}
          </span>
        );
      } else if (status === 3) {
        return (
          <span className="text-green-500 font-medium">
            {statusLabels[status]}
          </span>
        );
      } else if (status === 2) {
        return (
          <span className="text-orange-500 font-medium">
            {statusLabels[status]}
          </span>
        );
      }

      // Fallback to the mapped label or default message
      return (
        <span className="text-gray-700 font-medium">
          {statusLabels[status] || "Trạng thái không xác định"}
        </span>
      );
    },
  },
  {
    id: "needToPay",
    header: "Tổng tiền",
    accessorFn: (row) => row.invoice?.needToPay, // Safely access nested field
    cell: ({ getValue }) => {
      const money = getValue();

      // Handle invalid values
      if (typeof money !== "number" || isNaN(money)) {
        return <div>Không xác định</div>;
      }

      // Format as Vietnamese currency
      const formattedMoney = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(money);

      return <div>{formattedMoney}</div>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.id)}
            >
              Sao chép mã đơn
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleViewCustomer(order)}>
              Cập nhật đơn hàng
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
