"use client";
import HeaderSeler from "@/components/seller/header/page";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiDeleteBin5Line } from "react-icons/ri";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInvoiceContext } from "@/context/invoice-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Material } from "@/lib/actions/material-store/type/material-store";
export default function OrderSellerPage() {
  const [searchTerm, setSearchTerm] = useState<string>(""); // Chuỗi nhập vào
  const [filteredData, setFilteredData] = useState<string[]>([]); // Mảng chuỗi
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // Boolean
  const [discount, setDiscount] = useState(0);
  const [customerPaid, setCustomerPaid] = useState(0);
  const handleInputChangeNumber = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<number>>
  ) => {
    // Lấy giá trị thô và loại bỏ các ký tự không phải số
    const rawValue = e.target.value.replace(/[^0-9]/g, "");

    // Cập nhật state với giá trị số nguyên
    setState(Number(rawValue));
  };

  const now = new Date();

  // Định dạng ngày
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
 
  interface Invoice {
    id: string; // Unique identifier for the invoice
    name: string; // Name of the invoice
    materials: Material[]; // List of selected materials for this invoice
  }
  type Location = {
    value: string;
    label: string;
  };
  const {
    invoices,
    activeInvoiceIndex,
    handleSelectMaterial,
    updateQuantity,
    handleQuantityChange,
    handleRemoveMaterial,
  } = useInvoiceContext();

  const activeInvoice = invoices[activeInvoiceIndex];
  const calculateTotals = (invoice: Invoice) => {
    const totals = invoice.materials.reduce(
      (acc, material) => {
        acc.totalQuantity += material.quantity;
        acc.totalPrice += material.materialPrice * material.quantity;
        return acc;
      },
      { totalQuantity: 0, totalPrice: 0 } // Initial values
    );

    return totals;
  };
  const totals = calculateTotals(activeInvoice);

  const [amountDue, setAmountDue] = useState(totals.totalPrice - discount);
  useEffect(() => {
    setAmountDue(totals.totalPrice - discount);
  }, [discount, totals.totalPrice]);

  const [name, setName] = useState<string | null>();
  const [email, setEmail] = useState<string | null>();
  const [phone, setPhone] = useState<string | null>();
  const [address, setAddress] = useState<string | null>();
  const [note, setNote] = useState<string | null>();

  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");

  const [openProvince, setOpenProvince] = useState(false);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [openWard, setOpenWard] = useState(false);
  //   const fullAddress = `${address ?? ""}, ${
  //     selectedWard
  //       ? wards.find((ward) => ward.value === selectedWard)?.label + ", "
  //       : ""
  //   }${
  //     selectedDistrict
  //       ? districts.find((district) => district.value === selectedDistrict)
  //           ?.label + ", "
  //       : ""
  //   }${
  //     selectedProvince
  //       ? provinces.find((province) => province.value === selectedProvince)?.label
  //       : ""
  //   }`.trim();

  // console.log(paymentType);
  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };
  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };
  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(event.target.value);
  };

  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((response) =>
        setProvinces(
          response.data.map((item: any) => ({
            value: item.code,
            label: item.name,
          }))
        )
      )
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);

  // Fetch districts based on selected province
  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
        .then((response) =>
          setDistricts(
            response.data.districts.map((item: any) => ({
              value: item.code,
              label: item.name,
            }))
          )
        )
        .catch((error) => console.error("Error fetching districts:", error));
    } else {
      setDistricts([]);
    }
    setSelectedDistrict("");
    setSelectedWard("");
  }, [selectedProvince]);
  const data: string[] = [
    "Khách hàng 1",
    "Khách hàng 2",
    "Khách hàng 3",
    "Khách hàng 4",
  ];

  const shipper: string[] = ["Cường", "Hưng", "Đạt", "Mẫn"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      const filtered = data.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };
  // Fetch wards based on selected district
  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
        .then((response) =>
          setWards(
            response.data.wards.map((item: any) => ({
              value: item.code,
              label: item.name,
            }))
          )
        )
        .catch((error) => console.error("Error fetching wards:", error));
    } else {
      setWards([]);
    }
    setSelectedWard("");
  }, [selectedDistrict]);
  return (
    <div className="grid w-full h-full grid-cols-5 grid-rows-1 gap-4">
      <div className="col-span-2">
        <div className="grid h-full grid-cols-1 grid-rows-7 gap-4">
          <div className="row-span-5 h-full p-1 space-y-[1px] overflow-hidden overflow-y-auto scrollbar-thin">
            {activeInvoice?.materials?.map((item, index) => (
              <div
                key={item.id}
                className="bg-white border border-transparent hover:border-blue-500 flex flex-col justify-between w-full p-2 px-5 h-20 rounded-lg shadow-lg"
              >
                <div className="flex justify-between">
                  <div className="flex gap-5">
                    <h2>{index + 1}</h2>
                    <button onClick={() => handleRemoveMaterial(item.id)}>
                      <RiDeleteBin5Line size={20} />
                    </button>
                    <h2>{item.materialCode}</h2>
                    <h2 className="ml-5 capitalize">
                      {item.variantName || item.materialName}
                    </h2>
                  </div>
                  <div className="p-1 hover:p-1 hover:rounded-full hover:bg-slate-300">
                    <PiDotsThreeOutlineVerticalFill size={20} />
                  </div>
                </div>

                <div className="grid grid-cols-5 grid-rows-1 gap-4">
                  <div className="col-span-2">
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
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
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

                  <div className="col-span-3 col-start-3">
                    <div className="flex gap-10 justify-center items-center">
                      <div className="w-32 border-b text-end">
                        {item.materialPrice.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "vnd",
                        })}
                      </div>
                      <div className="font-bold">
                        {(item.materialPrice * item.quantity).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "vnd",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="row-span-2 py-5 h-full row-start-6">
            <div className="bg-white h-full rounded-lg shadow-lg grid grid-cols-5 grid-rows-1 gap-4">
              <div className="col-span-2 ml-2 my-auto">
                <Textarea placeholder="Nhập ghi chú vào đây" />
              </div>
              <div className="col-span-3 gap-3 justify-center flex flex-col h-full col-start-3">
                <div className="flex justify-between gap-10 mx-5">
                  <div>
                    Tổng tiền hàng: <span>{totals.totalQuantity}</span>
                  </div>
                  <div className="font-bold">
                    {totals.totalPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "vnd",
                    })}
                  </div>
                </div>
                <div className="flex justify-between gap-10 mx-5">
                  <div>Giảm giá:</div>
                  <div className="font-bold w-24 border-b">
                    <input
                      type="text"
                      onChange={(e) => handleInputChangeNumber(e, setDiscount)}
                      className="w-20 text-end"
                      value={discount.toLocaleString("vi-VN")}
                    />{" "}
                    đ
                  </div>
                </div>
                <div className="flex justify-between gap-10 mx-5">
                  <div>Khách cần trả:</div>
                  <div className="font-bold text-blue-500">
                    {amountDue.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "vnd",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-3 col-start-3">
        <div className="grid h-full grid-cols-3 grid-rows-1 gap-4">
          <div className="col-span-2">
            <div className="bg-white flex flex-col justify-between h-full w-full rounded-lg shadow-lg">
              <div className="p-2">
                <div className="flex justify-between mb-3">
                  <h1 className="font-bold ml-5">CMMS</h1>
                  <div className="flex justify-between gap-5">
                    <h1 className="text-slate-400">{formattedDate}</h1>
                    <h1 className="text-slate-400">{formattedTime}</h1>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="relative w-[85%]">
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
                      placeholder="Tìm khách hàng"
                      value={searchTerm}
                      onChange={handleInputChange}
                      onFocus={() => searchTerm && setShowDropdown(true)}
                      onBlur={() =>
                        setTimeout(() => setShowDropdown(false), 200)
                      }
                    />
                    {showDropdown && (
                      <ul className="absolute left-0 z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredData.length > 0 ? (
                          filteredData.map((item, index) => (
                            <li
                              key={index}
                              className="p-2 hover:bg-blue-100 cursor-pointer"
                              onMouseDown={() => setSearchTerm(item)}
                            >
                              {item}
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
                  <div>
                    <HoverCard openDelay={100} closeDelay={200}>
                      <HoverCardTrigger>
                        <Button variant="ghost" className="">
                          <FaPlus size={22} />
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="p-2 w-full px-5">
                        Thêm tài khoản
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                </div>
                <div className="grid grid-cols-2 grid-rows-1 gap-4">
                  <div className="grid mt-3 items-center gap-1.5">
                    <Label className="text-[16px]" htmlFor="Tên người nhận">
                      Tên người nhận
                    </Label>
                    <Input
                      className="w-full"
                      type="text"
                      id="name"
                      readOnly
                      value={name ?? ""}
                      placeholder="Tên người nhận"
                    />
                  </div>
                  <div className="grid mt-3 items-center gap-1.5">
                    <Label className="text-[16px]">Số điện thoại</Label>
                    <Input
                      className="w-full"
                      type="tel"
                      id="phone"
                      value={phone ?? ""}
                      onChange={handlePhoneChange}
                      placeholder="Số điện thoại"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 grid-rows-1 gap-4">
                  <div className="grid mt-3 items-center gap-1.5">
                    <Label className="text-[16px]">Địa chỉ chi tiết</Label>
                    <Input
                      className="w-full"
                      type="text"
                      id="adress"
                      value={address ?? ""}
                      onChange={handleAddressChange}
                      placeholder="Địa chỉ"
                    />
                  </div>
                  <div className="grid mt-3 items-center gap-1.5">
                    <Label className="text-[16px]">Tỉnh thành</Label>
                    <Popover open={openProvince} onOpenChange={setOpenProvince}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openProvince}
                          className="w-full justify-between"
                        >
                          {selectedProvince
                            ? provinces.find(
                                (province) =>
                                  province.value === selectedProvince
                              )?.label
                            : "Chọn tỉnh..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[240px] sm:w-[500px] lg:w-[200px] xl:w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder="Tìm kiếm tỉnh..." />
                          <CommandList>
                            <CommandEmpty>Không tìm thấy!</CommandEmpty>
                            <CommandGroup>
                              {provinces.map((province) => (
                                <CommandItem
                                  key={province.value}
                                  onSelect={() => {
                                    setSelectedProvince(province.value);
                                    setOpenProvince(false);
                                  }}
                                >
                                  <Check
                                    className={
                                      selectedProvince === province.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    }
                                  />
                                  {province.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-2 grid-rows-1 gap-4">
                  {/* District Selector */}

                  <div className="grid mt-3 items-center gap-1.5">
                    <Label className="text-[16px]">Quận huyện</Label>
                    <Popover open={openDistrict} onOpenChange={setOpenDistrict}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openDistrict}
                          className="w-full justify-between"
                          disabled={!selectedProvince}
                        >
                          {selectedDistrict
                            ? districts.find(
                                (district) =>
                                  district.value === selectedDistrict
                              )?.label
                            : "Chọn quận/huyện..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[240px] sm:w-[500px] lg:w-[200px] xl:w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder="Tìm kiếm quận/huyện..." />
                          <CommandList>
                            <CommandEmpty>Không tìm thấy!</CommandEmpty>
                            <CommandGroup>
                              {districts.map((district) => (
                                <CommandItem
                                  key={district.value}
                                  onSelect={() => {
                                    setSelectedDistrict(district.value);
                                    setOpenDistrict(false);
                                  }}
                                >
                                  <Check
                                    className={
                                      selectedDistrict === district.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    }
                                  />
                                  {district.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Ward Selector */}
                  <div className="grid  mt-3 items-center gap-1.5">
                    <Label className="text-[16px]">Phường xã</Label>
                    <Popover open={openWard} onOpenChange={setOpenWard}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openWard}
                          className="w-full justify-between"
                          disabled={!selectedDistrict}
                        >
                          {selectedWard
                            ? wards.find((ward) => ward.value === selectedWard)
                                ?.label
                            : "Chọn phường/xã..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[240px] sm:w-[500px] lg:w-[200px] xl:w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder="Tìm kiếm phường/xã..." />
                          <CommandList>
                            <CommandEmpty>Không tìm thấy!</CommandEmpty>
                            <CommandGroup>
                              {wards.map((ward) => (
                                <CommandItem
                                  key={ward.value}
                                  onSelect={() => {
                                    setSelectedWard(ward.value);
                                    setOpenWard(false);
                                  }}
                                >
                                  <Check
                                    className={
                                      selectedWard === ward.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    }
                                  />
                                  {ward.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid mt-3 items-center gap-1.5">
                  <Label className="text-[16px]">Ghi chú</Label>
                  <Textarea
                    value={note ?? ""}
                    onChange={handleNoteChange}
                    placeholder="Nhập ghi chú vào đây."
                  />
                </div>
              </div>
              <div className="px-5 py-8">
                <div className="flex justify-between">
                  <h1 className="font-bold">Khách thanh toán</h1>
                  <input
                    type="text"
                    onChange={(e) =>
                      handleInputChangeNumber(e, setCustomerPaid)
                    }
                    className="w-28 text-end font-bold border-b"
                    value={customerPaid.toLocaleString("vi-VN")}
                  />
                </div>
                <div className="flex justify-between mt-3">
                  <h1 className="font-bold">Thu hộ tiền (COD)</h1>
                  <div className="font-bold text-xl">
                    {(customerPaid >= amountDue
                      ? 0
                      : amountDue - customerPaid
                    ).toLocaleString("vi-VN")}
                  </div>
                </div>
                {customerPaid > amountDue && (
                  <div className="flex justify-between mt-3">
                    <h1>Tiền thừa khách hàng</h1>
                    <div className="font-bold text-blue-500">
                      {(customerPaid - amountDue).toLocaleString("vi-VN")} đ
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-start-3 flex flex-col justify-between p-5 bg-white rounded-lg shadow-lg">
            <div>
              <div className="flex text-blue-500 font-bold items-center gap-3 justify-center">
                <MdDeliveryDining size={30} />
                Vận chuyển
              </div>

              <h1 className="mt-5">Chọn nhân viên giao hàng</h1>
              <div className="mt-5">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn đối tác" />
                  </SelectTrigger>
                  <SelectContent>
                    {shipper.map((item) => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Button className="text-2xl font-bold w-full py-10 bg-blue-500 text-white hover:bg-blue-700">
                Thanh toán
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
