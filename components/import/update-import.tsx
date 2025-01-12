"use client";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useMaterialContext } from "@/context/import-context";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineDownloadDone } from "react-icons/md";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetSuplier } from "@/lib/actions/supplier/react-query/supplier-query";
import { FaSave } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { Textarea } from "@/components/ui/textarea";
import { useGetStore } from "@/lib/actions/store/react-query/store-query";
import {
  CreateImportAction,
  UpdateImportAction,
} from "@/lib/actions/import/action/import-action";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "nextjs-toploader/app";

import { useGetMaterialWarehouse } from "@/lib/actions/materials/react-query/material-query";

import { Skeleton } from "../ui/skeleton";
import { IImport, IImportDetail } from "@/lib/actions/import/type/import-type";
import { useParams } from "next/navigation";
import { useGetImportById } from "@/lib/actions/import/react-quert/import-query";
interface IMaterial {
  id: string;
  materialId: string;
  materialCode: string | null;
  materialName: string;
  materialImage: string;
  variantId: string | null;
  variantName: string | null;
  variantImage: string | null;
  quantity: number;
  materialPrice: number;
  variantPrice: number;
  lastUpdateTime: string;
  discount: number;
  note: string;
}

export default function UpdateImport() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const { id } = useParams();
  const router = useRouter();
  const {
    materials,
    addList,
    updateDiscount,
    remove,
    updateNote,
    updateQuantity,
    changeQuantity,
  } = useMaterialContext();
  const [searchTerm, setSearchTerm] = useState<string>(""); // Chuỗi nhập vào
  const [discount, setDiscount] = useState(0);
  const [selectedStore, setSelectedStore] = useState({ id: "", name: "" });
  const [where, setWhere] = useState("kho");
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // Boolean
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [supId, setSupId] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChangeNote = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNote(event.target.value);
  };
  const handleStoreChange = (value: any) => {
    const selectedStoreObject = stores?.data.find((item) => item.id === value);
    setSelectedStore(selectedStoreObject || { id: "", name: "" }); // Handle potential missing store
  };
  const handleValueChangeWhre = (value: string) => {
    setWhere(value);
  };
  const handleInputChangeNumber1 = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<number>>
  ) => {
    // Lấy giá trị thô và loại bỏ các ký tự không phải số
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    const newDiscount = Number(rawValue);

    // Nếu discount bằng totalPrice, không cho phép thay đổi hoặc xóa
    if (newDiscount === totals.totalPrice) {
      return; // Không cập nhật nếu giá trị nhập vào bằng tổng giá trị
    }

    // Nếu discount lớn hơn totalPrice, đặt discount bằng totalPrice
    if (newDiscount > totals.totalPrice) {
      setState(totals.totalPrice);
      return;
    }

    // Cập nhật state với giá trị số nguyên hợp lệ
    setState(newDiscount);
  };

  const now = new Date();
  const formattedDate = now.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Định dạng giờ
  const formattedTime = now.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const [searchParams, setSearchParams] = useState({
    page: 1,
    itemPerPage: 10,
  });
  const { data: importDetail, isLoading: isLoadingImportDetail } =
    useGetImportById(id.toString());

  const addImportDetails = (importDetails: IImportDetail[]) => {
    importDetails.forEach((detail) => {
      const newMaterial: IMaterial = {
        id: detail.materialId, // Assuming materialId is unique
        materialId: detail.materialId,
        materialCode: detail.materialCode,
        materialName: detail.name,
        materialImage: "", // You may want to set this based on your data
        variantId: detail.variantId,
        variantName: "", // You may want to set this based on your data
        variantImage: "", // You may want to set this based on your data
        quantity: detail.quantity,
        materialPrice: detail.unitPrice,
        variantPrice: detail.unitImportPrice,
        lastUpdateTime: new Date().toISOString(), // Set current time or based on your data
        discount: detail.unitDiscount,
        note: detail.note,
      };
      addList(newMaterial);
      changeQuantity(detail.materialId, detail.quantity);
    });
  };

  useEffect(() => {
    if (importDetail && Array.isArray(importDetail.data?.importDetails)) {
      addImportDetails(importDetail.data.importDetails);
    }
  }, [importDetail]);

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      materialName: searchTerm,
    }));
  }, [searchTerm]);
  // Fetch material store list
  const { data: materialsList, isLoading: isLoadingMaterialData } =
    useGetMaterialWarehouse(searchParams);

  //Fetch supplier
  const { data: suppliers, isLoading: isLoadingSuplier } = useGetSuplier();
  console.log(suppliers);
  const { data: stores, isLoading: isLoadingStore } = useGetStore();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.trim() !== "");
  };

  const totals = materials.reduce(
    (acc, item) => {
      const totalPrice =
        ((item.variantPrice || item.materialPrice) - item.discount) *
        item.quantity;
      acc.totalQuantity += item.quantity;
      acc.totalPrice += totalPrice;
      return acc;
    },
    { totalQuantity: 0, totalPrice: 0 }
  );

  const importDetails = materials.map((item) => ({
    id: item.id || null,
    materialId: item.materialId,
    variantId: item.variantId,
    quantity: item.quantity,
    unitPrice: item.variantPrice || item.materialPrice,
    unitDiscount: item.discount,
    priceAfterDiscount:
      ((item.variantPrice || item.materialPrice) - item.discount) *
      item.quantity,
    note: item.note,
  }));

  const handleOnSumit = async (status: string) => {
    if (where === "store" && !selectedStore.id) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn cửa hàng!!!",
        variant: "destructive",
      });
      return;
    }
    if (!supId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn nhà cung cấp.",
        variant: "destructive",
      });
      return;
    }

    if (!importDetails || importDetails.length === 0) {
      toast({
        title: "Lỗi",
        description: "Danh sách chi tiết nhập hàng không được để trống.",
        variant: "destructive",
      });
      return;
    }

    const Data = {
      importId: importDetail?.data?.id,
      supplierId: supId,
      quantity: totals.totalQuantity,
      totalPrice: totals.totalPrice,
      totalDiscount: discount,
      storeId: selectedStore.id,
      note: note,
      status: status,
      timeStamp: now,
      totalDue: totals.totalPrice - discount,
      importDetails: importDetails,
    };
    setLoading(true);
    try {
      const response = await UpdateImportAction(Data);
      if (response.success) {
        toast({
          title: "Thành công.",
          description: "Tạo phiếu nhập thành công!!",
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });
        router.push("/import");
      } else {
        toast({
          title: "Lỗi",
          description: "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Lỗi",
        description: "Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[80%] mx-auto h-full pt-5">
      <div className="grid grid-cols-7 h-full  grid-rows-1 gap-4">
        <div className="col-span-5 ">
          <div className="h-full flex flex-col">
            <div className="flex gap-5 items-center">
              <Link href="/import">
                <Button
                  className="bg-transparent border-none shadow-none p-5 hover:bg-slate-300"
                  variant="outline"
                  size="icon"
                >
                  <IoMdArrowRoundBack size={40} />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Nhập hàng</h1>
              <div className="relative w-[50%]">
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
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                />

                {showDropdown && (
                  <ul className="absolute left-0 z-10 w-full p-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {isLoadingMaterialData ? (
                      <div>
                        <Skeleton className="h-[50px] w-full rounded-xl" />
                      </div>
                    ) : materialsList?.data.length === 0 ? (
                      <li className="p-2 text-gray-500">Không có dữ liệu</li>
                    ) : (
                      materialsList?.data.map((item, index) => (
                        <li
                          key={index}
                          onClick={() =>
                            addList({
                              ...item,
                              variantPrice: item.variantPrice ?? 0, // Ensure variantPrice is a number
                              discount: 0,
                              note: "",
                            })
                          }
                          className="p-2 rounded-lg hover:bg-blue-100 cursor-pointer"
                        >
                          <div className="max-w-md mx-auto">
                            {/* First Product */}
                            <div className="flex items-center rounded">
                              <img
                                alt="Blue protective workwear"
                                className="w-14 h-14 mr-4 object-cover"
                                src={item.variantImage || item.materialImage}
                              />
                              <div className="flex-1">
                                <div className="text-black font-semibold">
                                  {item.variantName || item.materialName}
                                </div>
                                <div className="text-gray-600">
                                  {item.materialCode}
                                </div>
                                <div className="text-gray-600">
                                  Tồn: {item.quantity} | KH đặt: 0
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
                    )}
                  </ul>
                )}
              </div>
            </div>
            <div className="mt-5 flex-1 h-full bg-white border border-slate-200">
              <div className="grid grid-cols-10 grid-rows-1 gap-4 p-3 bg-blue-100">
                <div className="grid grid-cols-2 grid-rows-1 gap-4 text-center">
                  <div></div>
                  <div>STT</div>
                </div>
                <div>Mã hàng</div>
                <div className="col-span-3">Đơn hàng</div>
                <div className="col-start-6">Số lượng</div>
                <div className="col-start-7">Đơn giá</div>
                <div className="col-start-8">Giảm giá</div>
                <div className="col-start-9 col-span-2">Thành tiền</div>
              </div>
              <div className="max-h-full overflow-y-auto">
                {materials.map((item, index) => (
                  <div
                    key={item.id}
                    className={`grid grid-cols-10 grid-rows-1 gap-4 p-3 border-t bg-white hover:bg-green-100 ${
                      index === materials.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="grid grid-cols-2 grid-rows-1 gap-4 text-center ">
                      <div>
                        <button onClick={() => remove(item.id)}>
                          <RiDeleteBin5Line size={20} />
                        </button>
                      </div>
                      <div>{index + 1}</div>
                    </div>
                    <div>{item.materialCode || `SP0000${index + 1}`}</div>
                    <div className="col-span-3">
                      <div>
                        <h1>{item.variantName || item.materialName}</h1>
                        <Popover>
                          <PopoverTrigger className="text-slate-500">
                            {item.note ? (
                              item.note
                            ) : (
                              <div className="flex items-center gap-3">
                                Ghi chú{" "}
                                <CiEdit className="hover:text-blue-500" />
                              </div>
                            )}
                          </PopoverTrigger>
                          <PopoverContent className={cn("p-0")}>
                            <textarea
                              value={item.note}
                              onChange={(e) =>
                                updateNote(item.id, e.target.value)
                              } // Cập nhật note khi thay đổi
                              className="w-full p-2 border rounded"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="col-start-6">
                      <div className="flex justify-center items-center">
                        {/* Nút giảm */}
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, false)}
                          className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                        >
                          <svg
                            className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 2"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M1 1h16"
                            />
                          </svg>
                        </button>

                        {/* Hiển thị số lượng */}
                        <input
                          type="text"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value);
                            if (!isNaN(newQuantity)) {
                              changeQuantity(item.id, newQuantity);
                            }
                          }}
                          className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                        />

                        {/* Nút tăng */}
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, true)}
                          className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                        >
                          <svg
                            className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 18"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 1v16M1 9h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="col-start-7">
                      {(item.variantPrice || item.materialPrice).toLocaleString(
                        "vi-VN"
                      )}
                    </div>
                    <div className="col-start-8">
                      <input
                        type="text"
                        value={item.discount} // Không sử dụng `toLocaleString` ở đây
                        onChange={(e) => {
                          // Xóa dấu phân cách nếu có
                          const newDiscount =
                            parseInt(e.target.value.replace(/,/g, ""), 10) || 0;
                          if (
                            newDiscount >
                            (item.variantPrice || item.materialPrice) *
                              item.quantity
                          ) {
                            updateDiscount(
                              item.id,
                              (item.variantPrice || item.materialPrice) *
                                item.quantity
                            );
                            return; // Dừng lại nếu discount vượt quá totalPrice
                          }
                          // Cập nhật giá trị discount qua context
                          updateDiscount(item.id, newDiscount);
                        }}
                        onBlur={(e) => {
                          // Định dạng lại giá trị sau khi rời khỏi input
                          const formattedValue =
                            item.discount.toLocaleString("vi-VN");
                          e.target.value = formattedValue; // Hiển thị dạng phân cách
                        }}
                        className="w-full text-center border-b border-gray-300"
                      />
                    </div>
                    <div className="col-start-9 col-span-2">
                      {(
                        ((item.variantPrice || item.materialPrice) -
                          (item.discount || 0)) *
                        item.quantity
                      ).toLocaleString("vi-VN")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 col-start-6 h-full bg-white border rounded-sm shadow-md p-3">
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-5">
              <div className="flex justify-end">
                <h1 className="text-slate-400">
                  {formattedDate} - {formattedTime}
                </h1>
              </div>

              <div className="flex justify-between items-center gap-5">
                <h1>Nhà cung cấp: </h1>

                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[180px] justify-between"
                    >
                      {value
                        ? suppliers?.data.find(
                            (supplier) => supplier.name === value
                          )?.name
                        : "Chọn nhà cung cấp"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Tìm kiếm nhà cung cấp..." />
                      <CommandList>
                        <CommandEmpty>
                          Không tìm thấy nhà cung cấp.
                        </CommandEmpty>
                        {suppliers?.data?.map((supplier) => (
                          <CommandItem
                            key={supplier.id}
                            value={supplier.name}
                            onSelect={(currentValue) => {
                              setValue(
                                currentValue === value ? "" : currentValue
                              );
                              setSupId(supplier.id);
                              setOpen(false);
                            }}
                          >
                            {supplier.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                value === supplier.name
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex justify-between items-center gap-5">
                <div className="flex gap-5">
                  <h1>Tổng tiền hàng:</h1>
                  <h1>{totals.totalQuantity}</h1>
                </div>
                <div className="">
                  {totals.totalPrice.toLocaleString("vi-VN")}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <h1>Giảm giá: </h1>

                <div className="">
                  <input
                    type="text"
                    onChange={(e) => handleInputChangeNumber1(e, setDiscount)}
                    className="text-end w-24 border-b"
                    value={discount.toLocaleString("vi-VN")}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <h1 className="font-bold">Cần trả nhà cung cấp:</h1>
                <div className="text-blue-500">
                  {(totals.totalPrice - discount).toLocaleString("vi-VN")}
                </div>
              </div>
              <div>
                <h1 className="mb-2">Ghi chú</h1>
                <Textarea onChange={handleChangeNote} value={note} />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-2 grid-rows-1 gap-4">
                <div>
                  <Button
                    onClick={() => handleOnSumit("")}
                    className="w-full py-10 bg-blue-500 2xl:text-2xl text-xl mb-5 font-bold text-white hover:bg-blue-600"
                  >
                    <FaSave /> Tạm lưu
                  </Button>
                </div>
                <div>
                  {loading ? (
                    <Button
                      disabled
                      className="w-full py-10 2xl:text-2xl text-xl mb-5 font-bold"
                    >
                      <Loader2 /> Đang xử lý
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleOnSumit("Đã nhập hàng")}
                      className="w-full py-10 bg-green-500 2xl:text-2xl text-xl mb-5 font-bold text-white hover:bg-green-600"
                    >
                      <MdOutlineDownloadDone /> Hoàn thành
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
