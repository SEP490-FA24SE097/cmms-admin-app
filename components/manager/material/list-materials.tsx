"use client";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RiDiscountPercentLine } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { CalendarIcon, Loader2 } from "lucide-react";
import { useGetSuplier } from "@/lib/actions/supplier/react-query/supplier-query";
import { useGetImport } from "@/lib/actions/import/react-quert/import-query";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useGetMaterialWarehouse } from "@/lib/actions/materials/react-query/material-query";
import AddMaterials from "./add-materials";
import { RxUpdate } from "react-icons/rx";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  CreateDiscount,
  UpdateStock,
} from "@/lib/actions/materials/action/material-action";
import { IMaterialWarehouse } from "@/lib/actions/materials/type/material-type";
import { UpdateTracking } from "@/lib/actions/notes/action/note-action";
export default function ListMaterials() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [openM, setOpenM] = useState(false);
  const [discount, setDiscount] = useState<number | 0>(0);
  const [minStock, setMinStock] = useState(0);
  const [maxStock, setMaxStock] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [discountType, setDiscountType] = useState<string>("1");
  const handleChangeDiscount =
    (price: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(event.target.value);
      const validValue = isNaN(value) ? 0 : Math.max(0, Math.min(value, price));
      setDiscount(validValue);
    };

  const handleChangeMinStock = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Number(event.target.value));
    setMinStock(value);
  };

  const handleChangeMaxStock = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Number(event.target.value));
    setMaxStock(value);
  };
  const [selectedSupplier, setSelectSuplier] = useState({ id: "", name: "" });
  const handleSupllierChange = (value: any) => {
    const selectedStoreObject = suppliers?.data.find(
      (item) => item.id === value
    );
    setSelectSuplier(selectedStoreObject || { id: "", name: "" });
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

  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams, setSearchParams] = useState({
    page: currentPage,
    itemPerPage: 10,
  });

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      page: currentPage,
      supplierId: selectedSupplier.id,
    }));
  }, [selectedSupplier.id, currentPage]);

  const { data: suppliers, isLoading: isLoadingSuplier } = useGetSuplier();
  const { data: materialsWarehouse, isLoading: isLoadingMaterialsWarehouse } =
    useGetMaterialWarehouse(searchParams);
  const [filteredData, setFilteredData] = useState<IMaterialWarehouse[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // Boolean
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter data and handle undefined case
    const filtered = (materialsWarehouse?.data || []).filter((item) =>
      item.materialName.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(filtered);
    setShowDropdown(value.trim() !== "");
  };
  const totalPages = materialsWarehouse?.totalPages || 1;
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const getFinalDiscount = () => {
    if (discountType === "2" && discount) {
      return `${discount}%`; // Append "%" for percentage type
    }
    return `${discount}`; // Default to discount as a number for currency type
  };
  const [selectMaterialId, setSelectMaterialId] = useState("");
  const [selectVariantId, setSelectVariantId] = useState("");
  // Lưu giá trị trả về từ getFinalDiscount
  const finalDiscount = getFinalDiscount();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleCreateDiscount = async () => {
    if (discount && discount < -1) {
      toast({
        title: "Lỗi",
        description: "Không được để giảm giá âm.",
        variant: "destructive",
      });
      return;
    }

    const data = {
      materialId: selectMaterialId,
      variantId: selectVariantId || null,
      discount: finalDiscount,
    };
    setLoading(true);

    try {
      const result = await CreateDiscount(data);
      if (result.success) {
        toast({
          title: "Thành công",
          description: "Giảm giá đã được tạo thành công.",
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });

        queryClient.invalidateQueries({
          queryKey: ["MATERIAL_WAREHOUSE_LIST"],
        });
        setOpen(false);
      } else {
        toast({
          title: "Lỗi",
          description: result.error || "Có lỗi xảy ra khi tạo giảm giá.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi kết nối đến server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const [loadingS, setLoadingS] = useState(false);
  const [openS, setOpenS] = useState(false);
  const handleUpdateStock = async () => {
    if (!minStock) {
      toast({
        title: "Lỗi",
        description: "Không được để trống.",
        variant: "destructive",
      });
      return;
    }
    if (!maxStock) {
      toast({
        title: "Lỗi",
        description: "Không được để trống.",
        variant: "destructive",
      });
      return;
    }
    const data = {
      materialId: selectMaterialId,
      variantId: selectVariantId || null,
      minStock: minStock,
      maxStock: maxStock,
    };
    setLoadingS(true);

    try {
      const result = await UpdateStock(data);
      if (result.success) {
        toast({
          title: "Thành công",
          description: "Cập nhật định mức thành công.",
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });

        queryClient.invalidateQueries({
          queryKey: ["MATERIAL_WAREHOUSE_LIST"],
        });
        setOpenS(false);
      } else {
        toast({
          title: "Lỗi",
          description: result.error || "Có lỗi xảy ra khi cập nhật định mức.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi kết nối đến server.",
        variant: "destructive",
      });
    } finally {
      setLoadingS(false);
    }
  };
  const [selectedMaterials, setSelectedMaterials] = useState<
    IMaterialWarehouse[]
  >([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const handleQuantityChange = (materialId: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [materialId]: value,
    }));
  };

  const resultT = selectedMaterials.map((material) => ({
    materialId: material.materialId,
    variantId: material.variantId,
    quantityInSystem: material.quantity,
    quantityInReality: quantities[material.materialId] || 0, // Giá trị mặc định là 0 nếu chưa nhập
  }));

  const handleSelectMaterial = (material: IMaterialWarehouse) => {
    // Kiểm tra nếu vật liệu đã được chọn
    if (
      selectedMaterials.some(
        (item) => item.materialCode === material.materialCode
      )
    ) {
      // Nếu đã có, loại bỏ nó khỏi danh sách
      setSelectedMaterials((prev) =>
        prev.filter((item) => item.materialCode !== material.materialCode)
      );
    } else {
      setSelectedMaterials((prev) => [...prev, material]);
    }
  };
  const [loadingT, setLoadingT] = useState(false);
  const [openT, setOpenT] = useState(false);
  const handleUpdateTracking = async () => {
    if (resultT.length === 0) {
      toast({
        title: "Lỗi",
        description: "Không được để trống.",
        variant: "destructive",
      });
      return;
    }
    setLoadingT(true);
    try {
      const result = await UpdateTracking(resultT);
      if (result.success) {
        toast({
          title: "Thành công",
          description: "Cập nhật định mức thành công.",
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });

        queryClient.invalidateQueries({
          queryKey: ["MATERIAL_WAREHOUSE_LIST"],
        });
        setOpenT(false);
      } else {
        toast({
          title: "Lỗi",
          description: result.error || "Có lỗi xảy ra khi cập nhật định mức.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi kết nối đến server.",
        variant: "destructive",
      });
    } finally {
      setLoadingT(false);
    }
  };
  return (
    <div className="w-[90%] mx-auto mt-5">
      <div className="grid grid-cols-5 grid-rows-1 gap-4">
        <div className="text-2xl font-bold">Quản lý kho tổng</div>
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
                placeholder="Tìm mã phiếu"
                // value={searchTerm}
                // onChange={handleInputChange}
                // onFocus={() => searchTerm && setShowDropdown(true)}
                // onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />
            </div>
            <div className="flex gap-5">
              <Dialog open={openM} onOpenChange={setOpenM}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 text-white hover:bg-blue-600">
                    <FaPlus /> Tạo sản phẩm mới
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[1000px] h-[90vh]">
                  <DialogOverlay
                    className="bg-white p-5  overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2
                          [&::-webkit-scrollbar-track]:rounded-full
                          [&::-webkit-scrollbar-track]:bg-gray-100
                          [&::-webkit-scrollbar-thumb]:rounded-full
                          [&::-webkit-scrollbar-thumb]:bg-gray-300
                          dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 rounded-lg"
                  >
                    <DialogTitle>Thêm hàng hóa</DialogTitle>

                    <AddMaterials setOpenM={setOpenM} />
                  </DialogOverlay>
                </DialogContent>
              </Dialog>
              <Link href="/manage/materials/update-material">
                <Button className="bg-blue-500 text-white hover:bg-blue-600">
                  <RxUpdate /> Cập nhật vật liệu
                </Button>
              </Link>
              <Dialog open={openT} onOpenChange={setOpenT}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 text-white hover:bg-blue-600">
                    <FaPlus /> Kiểm kho
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[700px] h-[70vh]">
                  <DialogOverlay
                    className="bg-white p-5  overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2
                          [&::-webkit-scrollbar-track]:rounded-full
                          [&::-webkit-scrollbar-track]:bg-gray-100
                          [&::-webkit-scrollbar-thumb]:rounded-full
                          [&::-webkit-scrollbar-thumb]:bg-gray-300
                          dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 rounded-lg"
                  >
                    <DialogTitle>Kiểm kho</DialogTitle>

                    <div className="relative w-[100%]">
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
                        className="block w-full p-3 ps-10 text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tìm hàng hóa theo tên"
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={() => searchTerm && setShowDropdown(true)}
                        onBlur={() =>
                          setTimeout(() => setShowDropdown(false), 200)
                        }
                      />

                      {showDropdown && (
                        <ul className="absolute left-0 z-10 w-full p-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                              <li
                                key={index}
                                onClick={() => handleSelectMaterial(item)}
                                className={`p-2 rounded-lg hover:bg-blue-100 cursor-pointer ${
                                  selectedMaterials.some(
                                    (selected) =>
                                      selected.materialCode ===
                                      item.materialCode
                                  )
                                    ? "bg-blue-200"
                                    : ""
                                }`}
                              >
                                <div className="max-w-md">
                                  <div className="flex items-center rounded">
                                    <img
                                      alt="Blue protective workwear"
                                      className="w-14 h-14 mr-4 object-cover"
                                      src={
                                        item.variantImage || item.materialImage
                                      }
                                    />
                                    <div className="flex-1">
                                      <div className="text-black font-semibold">
                                        {item.variantName || item.materialName}
                                      </div>
                                      <div className="text-gray-600">
                                        {item.materialCode}
                                      </div>
                                    </div>
                                    <div className="text-blue-600 font-semibold">
                                      {(
                                        item.variantPrice || item.materialPrice
                                      ).toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "vnd",
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))
                          ) : (
                            <li className="p-2 text-gray-500">
                              Không có dữ liệu
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                    {selectedMaterials.length > 0 && (
                      <div className="mt-5">
                        {selectedMaterials.map((material, index) => (
                          <div
                            key={index}
                            className="flex items-center mt-3 border p-3 rounded"
                          >
                            <img
                              alt="Blue protective workwear"
                              className="w-14 h-14 mr-4 object-cover"
                              src={
                                material.variantImage || material.materialImage
                              }
                            />
                            <div className="flex-1">
                              <div className="text-black font-semibold">
                                {material.variantName || material.materialName}
                              </div>
                              <div className="text-gray-600">
                                {material.materialCode}
                              </div>
                            </div>
                            <div className="flex gap-2 mr-2">
                              <h1>Hiện tại:</h1>
                              <h1>{material.quantity}</h1>
                            </div>
                            <div className="flex gap-2">
                              <h1>Thực tế:</h1>
                              <input
                                type="number"
                                className="w-20 border-b"
                                value={quantities[material.materialId] || ""}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    material.materialId,
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-end mt-2 ">
                      {loadingT ? (
                        <Button>
                          <Loader2 /> Đang xử lý...
                        </Button>
                      ) : (
                        <Button
                          onClick={handleUpdateTracking}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Xác nhận
                        </Button>
                      )}
                    </div>
                  </DialogOverlay>
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
          <div className="bg-white shadow-lg p-5 rounded-xl">
            <h1 className="font-bold">Nhà cung cấp</h1>
            <div className="mt-5">
              <Select
                onValueChange={handleSupllierChange}
                value={selectedSupplier.id}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn nhà cung cấp" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers?.data.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="col-span-4 ">
          <div className="border h-auto">
            <div className="grid grid-cols-8 grid-rows-1 gap-4 bg-blue-100 p-3 font-bold">
              <div>Mã hàng</div>
              <div className="col-span-2">Tên sản phẩm</div>
              <div className="col-start-4">Giá bán</div>
              <div className="col-start-5">Giá vốn</div>
              <div className="col-start-6">Tồn kho</div>
              <div className="col-start-7">Đơn vị</div>
              <div className="col-start-8">Thời gian tạo</div>
            </div>
            {materialsWarehouse?.data.map((item, index) => (
              <Accordion type="single" collapsible key={index}>
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger
                    showIcon={false}
                    className={`grid grid-cols-8 grid-rows-1 gap-4 p-3 ${
                      index % 2 !== 0 ? "bg-slate-100" : "bg-white"
                    }`}
                  >
                    <div className="flex gap-2 items-center">
                      <img
                        src={item.variantImage || item.materialImage}
                        className="h-10 w-10"
                        alt=""
                      />
                      <h1>{item.materialCode}</h1>
                    </div>
                    <div className="col-span-2 capitalize">
                      {item.variantName || item.materialName}
                    </div>

                    <div className="col-start-4">
                      {(
                        item.variantPrice || item.materialPrice
                      )?.toLocaleString("vi-VN")}
                    </div>
                    <div className="col-start-5">
                      {(
                        item.variantCostPrice || item.materialCostPrice
                      )?.toLocaleString("vi-VN")}
                    </div>
                    <div className="col-start-6">
                      {item.quantity.toLocaleString("vi-VN")}
                    </div>
                    <div className="col-start-7">{item.unit}</div>
                    <div className="col-start-8">
                      {formatDateTime(item.lastUpdateTime)}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0">
                    <div className="py-2 border bg-white ">
                      <h1 className="text-2xl font-bold text-blue-500 ml-5">
                        {item.variantName || item.materialName}
                      </h1>
                      <div className="grid grid-cols-5 grid-rows-1 gap-4 p-2">
                        <div className="col-span-2">
                          <img
                            src={item.variantImage || item.materialImage}
                            className="h-80 w-80 object-cover ml-5"
                            alt=""
                          />
                        </div>
                        <div className="col-span-3 col-start-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="mb-2 border-b pb-2 font-bold">
                                <span className="font-bold">Mã hàng:</span>{" "}
                                {item.materialCode}
                              </div>

                              <div className="mb-2 border-b pb-2">
                                <span className="font-bold">Nhóm hàng:</span>{" "}
                                {item.parentCategory}
                              </div>
                              <div className="mb-2 border-b pb-2">
                                <span className="font-bold">Loại hàng:</span>{" "}
                                {item.category}
                              </div>
                              <div className="mb-2 border-b pb-2">
                                <span className="font-bold">Thương hiệu:</span>{" "}
                                {item.brand}
                              </div>
                              <div className="mb-2 border-b pb-2">
                                <span className="font-bold">Định mức tồn:</span>{" "}
                                {item.minStock} ➤ {item.maxStock}
                              </div>

                              <div className="mb-2 border-b pb-2">
                                <span className="font-bold">Giá vốn:</span>{" "}
                                {(
                                  item.variantCostPrice ||
                                  item.materialCostPrice
                                )?.toLocaleString("vi-VN")}
                              </div>
                              <div className="mb-2 border-b pb-2">
                                <span className="font-bold">Trọng lượng:</span>{" "}
                                {item.weight.toLocaleString("vi-VN")} kg
                              </div>
                            </div>
                            <div>
                              <div className="mb-2 border-b pb-2">
                                <span className="font-bold">Giảm giá:</span>{" "}
                                {item.discount || "Không có"}
                              </div>
                              <div className="mb-2 border-b pb-2 font-bold">
                                <span className="font-bold">Giá bán:</span>{" "}
                                {(
                                  item.variantPrice || item.materialPrice
                                ).toLocaleString("vi-VN")}
                              </div>
                              {item.afterDiscountPrice ? (
                                <div className="mb-2 border-b pb-2 font-bold">
                                  <span className="font-bold">
                                    Giá sau khi giảm:
                                  </span>{" "}
                                  {item.afterDiscountPrice.toLocaleString(
                                    "vi-VN"
                                  )}
                                </div>
                              ) : (
                                ""
                              )}
                              <div className="mb-2 border-b pb-2">
                                <span className="font-bold">Số lượng:</span>{" "}
                                {item.quantity || "0"}
                              </div>
                              <div className="mb-2 border-b pb-2">
                                <span className="font-bold">Nhà cung cấp</span>
                                <div className=" border-gray-300"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-5 pr-5 pb-3">
                        <AlertDialog open={openS} onOpenChange={setOpenS}>
                          <AlertDialogTrigger asChild>
                            <Button
                              onClick={() => {
                                setSelectMaterialId(item.materialId);
                                setSelectVariantId(item.variantId);
                              }}
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              <RxUpdate size={20} />
                              Cập nhật định mức
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Cập nhật định mức
                              </AlertDialogTitle>
                              <AlertDialogDescription className="space-y-5">
                                <div className="flex gap-2 text-black items-center">
                                  <h1 className="w-28 font-bold">Tối thiểu:</h1>
                                  <Input
                                    type="number"
                                    placeholder="Nhập định mức tối thiểu"
                                    value={minStock ?? ""} // Use an empty string if discount is undefined
                                    onChange={handleChangeMinStock}
                                  />
                                </div>
                                <div className="flex gap-2 text-black items-center">
                                  <h1 className="w-28 font-bold">Tối đa:</h1>
                                  <Input
                                    type="number"
                                    placeholder="Nhập định mức tối đa"
                                    value={maxStock ?? ""} // Use an empty string if discount is undefined
                                    onChange={handleChangeMaxStock}
                                  />
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              {loadingS ? (
                                <Button>
                                  <Loader2 /> Đang xử lý...
                                </Button>
                              ) : (
                                <Button onClick={handleUpdateStock}>
                                  Xác nhận
                                </Button>
                              )}
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog open={open} onOpenChange={setOpen}>
                          <AlertDialogTrigger asChild>
                            <Button
                              onClick={() => {
                                setSelectMaterialId(item.materialId);
                                setSelectVariantId(item.variantId);
                              }}
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              <RiDiscountPercentLine size={20} />
                              Thêm mã giảm giá
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Thêm mã giảm giá
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                <div className="flex gap-2 text-black items-center">
                                  <h1 className="w-28 font-bold">Giá giảm</h1>
                                  <Input
                                    type="number"
                                    placeholder="Nhập giá giảm"
                                    value={discount ?? ""} // Use an empty string if discount is undefined
                                    onChange={handleChangeDiscount(
                                      item.variantPrice || item.materialPrice
                                    )}
                                  />
                                  <Select
                                    value={discountType}
                                    onValueChange={(value) =>
                                      setDiscountType(value)
                                    }
                                  >
                                    <SelectTrigger className="w-[70px] font-bold">
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">đ</SelectItem>
                                      <SelectItem value="2">%</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              {loading ? (
                                <Button>
                                  <Loader2 /> Đang xử lý...
                                </Button>
                              ) : (
                                <Button onClick={handleCreateDiscount}>
                                  Xác nhận
                                </Button>
                              )}
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
          <div className="mt-5 flex items-center">
            <Pagination className={cn("justify-start w-auto mx-0")}>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 && handlePageChange(currentPage - 1)
                    }
                    aria-disabled={currentPage === 1}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  ></PaginationPrevious>
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={currentPage === index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className="cursor-pointer"
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < totalPages &&
                      handlePageChange(currentPage + 1)
                    }
                    aria-disabled={currentPage === totalPages}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  ></PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <div className="ml-5">
              Có {materialsWarehouse?.total} kết quả tìm kiếm
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
