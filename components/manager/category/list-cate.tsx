"use client";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { Calendar } from "@/components/ui/calendar";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { CalendarIcon } from "lucide-react";

import { useGetCategory } from "@/lib/actions/materials-fields/react-query/category-query";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function CategoryList() {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [nameCate, setNameCate] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const handleChangeCate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameCate(e.target.value);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const formatDateTime = (timeStamp: any) => {
    if (!timeStamp) return ""; // Kiểm tra giá trị null hoặc undefined
    const date = new Date(timeStamp);

    // Định dạng ngày tháng năm và giờ phút
    const formattedDate = date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formattedDate} ${formattedTime}`;
  };

  const { data: categories, isLoading: isLoadingCate } = useGetCategory();

  //  const handleCreateClick = async () => {

  //     if (nameCate === "") {
  //       toast({
  //         title: "Chưa chọn phường/xã",
  //         description: "Vui lòng chọn phường/xã.",
  //         variant: "destructive",
  //       });
  //       return;
  //     }

  //     const Data = {
  //       name: customerName,
  //       email: email,
  //       phoneNumber: phone,
  //       address: finalAdress,
  //     };

  //     try {
  //       setIsLoadingCreate(true);
  //       const response = await createSupplier(Data);
  //       if (response.success) {
  //         toast({
  //           title: "Tạo thành thành công",
  //           style: { backgroundColor: "#73EC8B", color: "#ffffff" },
  //         });
  //         setForm(false);
  //         queryClient.invalidateQueries({
  //           queryKey: ["SUPPLIER_LIST"],
  //         });
  //       } else if (response.error) {
  //         toast({
  //           title: response.error,
  //           description: "Vui lòng thử lại",
  //           variant: "destructive",
  //         });
  //         setIsLoadingCreate(false);
  //       }
  //     } catch (error) {
  //       toast({
  //         title: "Đăng ký thật bại",
  //         description: "Đăng ký thất bại vui lòng thử lại",
  //         variant: "destructive",
  //       });
  //       setIsLoadingCreate(false);
  //     } finally {
  //       setIsLoadingCreate(false);
  //     }
  //   };
  return (
    <div className="w-[80%] mx-auto mt-5">
      <div className="grid grid-cols-5 grid-rows-1 gap-4">
        <div className="text-2xl font-bold">Danh mục sản phẩm</div>
        <div className="col-span-4">
          <div className="flex justify-between">
            <div className="relative w-[40%]">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="search"
                className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tìm danh mục"
              />
            </div>
            <div className="items-center flex">
              <Dialog>
                <DialogTrigger>
                  <div>
                    <Button className="bg-blue-500 text-white hover:bg-blue-600">
                      <FaPlus size={22} /> Thêm danh mục
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tạo danh chính</DialogTitle>
                    <DialogDescription>
                      <div className="flex items-center ">
                        <h1 className="w-[30%] font-bold">Danh mục chính:</h1>
                        <Input
                          className="w-[65%]"
                          placeholder="Nhập tên"
                          value={nameCate}
                          onChange={handleChangeCate}
                        />
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    Xác nhận
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 grid-rows-1 gap-4 mt-5">
        <div className="space-y-5">
          <div className="bg-white shadow-lg p-5 rounded-xl">
            <h1 className="font-bold">Thời gian</h1>
            <div className="flex flex-col gap-1 mt-2">
              <h1 className="w-full">Từ ngày:</h1>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-[200px] pl-3 text-left font-normal"
                  >
                    <span>
                      {fromDate ? formatDate(fromDate) : "Chọn ngày bắt đầu"}
                    </span>
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate || undefined}
                    onSelect={(day) => setFromDate(day || null)} // Xử lý undefined
                    disabled={(date) =>
                      date > new Date() || date < new Date("2000-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-1 mt-2">
              <h1 className="w-full">Đến ngày:</h1>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-[200px] pl-3 text-left font-normal"
                  >
                    <span>
                      {toDate ? formatDate(toDate) : "Chọn ngày kết thúc"}
                    </span>
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate || undefined}
                    onSelect={(day) => setToDate(day || null)} // Xử lý undefined
                    disabled={
                      (date) => (fromDate ? date < fromDate : false) // Nếu fromDate là null, không cần disable
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div className="col-span-4 max-h-[900px] overflow-hidden overflow-y-auto">
          <div className="border h-auto">
            <div className="grid grid-cols-5 grid-rows-1 gap-4 bg-blue-100 p-3 font-bold">
              <div>STT</div>
              <div className="col-span-2">Danh mục chính</div>
              <div className="col-span-2 col-start-4">Danh mục phụ</div>
            </div>
            {categories?.data.map((item, index) => (
              <div key={item.id}>
                {item.subCategories.map((sub, subIndex) => (
                  <div
                    key={sub.id}
                    className={` grid grid-cols-5 grid-rows-1 gap-4 p-3 ${
                      subIndex % 2 !== 0 ? "bg-slate-100" : "bg-white"
                    }`}
                  >
                    <div>{`${index + 1}.${subIndex + 1}`}</div>
                    <div className="col-span-2">{item.name}</div>
                    <div className="col-span-2 col-start-4">{sub.name}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
