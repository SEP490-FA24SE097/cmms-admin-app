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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Invoice, useInvoiceContext } from "@/context/invoice-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";

import { Material } from "@/lib/actions/material-store/type/material-store";
import CreateCustomer from "../add-customer/page";
import { useGetCustomer } from "@/lib/actions/customer/react-query/customer-query";
import { ICustomer } from "@/lib/actions/customer/type/customer";
import { useToast } from "@/hooks/use-toast";
import { createQuickPayment } from "@/lib/actions/quick-payment/quick-payment";
import CreateShipper from "../add-shipper/page";
import { useGetShipper } from "@/lib/actions/shipper/react-query/shipper-query";
import { getShipPrice } from "@/lib/actions/shipper/action/shipper-action";
import { Loader2 } from "lucide-react";
export default function OrderSellerPage() {
  const [keyword, setKeyword] = useState<string>(""); // Chuỗi nhập vào
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState<string>(""); // Chuỗi nhập vào
  const [filteredData, setFilteredData] = useState<ICustomer[]>([]); // Mảng chuỗi
  const [selectedName, setSelectedName] = useState<string>(""); // Chuỗi nhập vào
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // Boolean
  const [discount, setDiscount] = useState(0);
  const [customerPaid, setCustomerPaid] = useState(0);

  const [selectedShipper, setSelectedShipper] = useState({
    id: "",
    fullName: "",
  });
  const [selectedPrice, setSelectedPrice] = useState({
    shippingFee: 0,
    totalWeight: 0,
    shippingDistance: 0,
    message: "",
  });
  const handleShipChange = (value: any) => {
    const selectedShipObject = shippers?.data.find((item) => item.id === value);
    setSelectedShipper(selectedShipObject || { id: "", fullName: "" }); // Handle potential missing store
  };
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
    handleRemoveInvoice,
  } = useInvoiceContext();

  const { data: shippers, isLoading: isLoadingShipper } = useGetShipper();

  const activeInvoice = invoices[activeInvoiceIndex];

  const handleGetPrice = async () => {
    if (activeInvoice.materials.length === 0) {
      toast({
        title: "Không có vật liệu",
        description: "Vui lòng chọn vật liệu ở phần tìm kiếm vật liệu!",
        variant: "destructive",
      });
      return;
    }

    if (!selectedWard) {
      toast({
        title: "Không có địa chỉ",
        description: "Vui lòng chọn nhập địa chỉ!",
        variant: "destructive",
      });
      return;
    }

    const data = {
      storeItems: activeInvoice.materials,
      deliveryAddress: fullAddress,
    };
    setIsLoadingPrice(true);
    const result = await getShipPrice(data);

    if (result && result.data) {
      // Update cartData and reset total price based on response
      setSelectedPrice({
        shippingFee: result.data.shippingFee || 0,
        totalWeight: result.data.totalWeight || 0,
        shippingDistance: result.data.shippingDistance || 0,
        message: result.data.message || "",
      });
      setIsLoadingPrice(false);
    } else {
      toast({
        title: "Có lỗi xảy ra",
        description: "Vui lòng thử lại sau!",
        variant: "destructive",
      });
      setIsLoadingPrice(false);
      return;
    }
  };

  const calculateTotals = (invoice: Invoice) => {
    const totals = invoice?.materials.reduce(
      (acc, material) => {
        acc.totalQuantity += material.number;
        acc.totalPrice += material.materialPrice * material.number;
        return acc;
      },
      { totalQuantity: 0, totalPrice: 0 } // Initial values
    );

    return totals;
  };
  const totals = calculateTotals(activeInvoice);

  const [amountDue, setAmountDue] = useState(totals?.totalPrice - discount);
  useEffect(() => {
    if (!invoices || invoices.length === 0) {
      setAmountDue(0);
    } else {
      setAmountDue(totals?.totalPrice - discount + selectedPrice.shippingFee);
    }
  }, [discount, totals?.totalPrice, selectedPrice.shippingFee, invoices]);

  const [name, setName] = useState<string | null>();
  const [email, setEmail] = useState<string | null>();
  const [phone, setPhone] = useState<string | null>();
  const [address, setAddress] = useState<string | null>();
  const [note, setNote] = useState<string | null>();

  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [openProvince, setOpenProvince] = useState(false);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [openWard, setOpenWard] = useState(false);
  const fullAddress = `${address ?? ""}, ${
    selectedWard
      ? wards.find((ward) => ward.value === selectedWard)?.label + ", "
      : ""
  }${
    selectedDistrict
      ? districts.find((district) => district.value === selectedDistrict)
          ?.label + ", "
      : ""
  }${
    selectedProvince
      ? provinces.find((province) => province.value === selectedProvince)?.label
      : ""
  }`.trim();

  // console.log(paymentType);
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
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

  const [searchCusParams, setSearchCusParams] = useState<
    Record<string, string | number | boolean>
  >({
    Email: keyword,
  });
  const { data: customers, isLoading: isLoadingCustomer } =
    useGetCustomer(searchCusParams);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (keyword === "") {
      const filtered = (customers?.data || []).filter((item) =>
        item.email.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered); // `filtered` will always be an array
      setShowDropdown(true);
    } else {
      setFilteredData([]); // Clear filteredData when dropdown is hidden
      setShowDropdown(false);
    }
  };
  const handleDeleteCus = () => {
    setSelectedName(""); // Set the input to the selected name
    setSelectedId(null); // Save the selected ID
  };
  const handleSelectItem = (item: ICustomer) => {
    setSearchTerm(item.fullName);
    setSelectedName(item.fullName); // Set the input to the selected name
    setSelectedId(item.id); // Save the selected ID
    setName(item.fullName);
    setPhone(item.phoneNumber);
    setEmail(item.email);
    setShowDropdown(false); // Hide the dropdown
  };
  useEffect(() => {
    setSearchCusParams((prev) => ({
      ...prev,
      Email: keyword,
    }));
  }, [keyword]);

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
  const storeItem = activeInvoice?.materials.map((item, index) => ({
    materialId: item.materialId, // Assuming each item in materials represents a materialId
    quantity: item.number,
    variantId: item.variantId, // Replace '1' with the desired logic to calculate quantity
  }));
  const handlePaymentClick = async () => {
    const isQuantityExceeded = activeInvoice?.materials.some(
      (item) => item.number > item.quantity - item.inOrderQuantity
    );
    if (isQuantityExceeded) {
      toast({
        title: "Lỗi số lượng",
        description: "Một số mặt hàng có số lượng vượt quá giới hạn cho phép.",
        variant: "destructive",
      });
      return;
    }
    if (selectedPrice.shippingDistance === 0) {
      toast({
        title: "Vui lòng lấy tiền ship",
        description: "Vui lòng lấy tiền ship ở phần lấy giá ship!",
        variant: "destructive",
      });
      return;
    }
    if (!selectedShipper.id) {
      toast({
        title: "Vui lòng chọn nhân viên vận chuyển",
        description: "Vui lòng chọn nhân viên giao hàng ở phần tìm kiếm!",
        variant: "destructive",
      });
      return;
    }
    if (selectedId === null) {
      toast({
        title: "Vui lòng chọn khách hàng",
        description: "Vui lòng chọn khách hàng ở phần tìm kiếm người dùng!",
        variant: "destructive",
      });
      return;
    }
    if (selectedPrice.message !== "") {
      toast({
        title: "Vượt quá khoảng cách 200km",
        description: "Vui lòng chọn địa chỉ khác.",
        variant: "destructive",
      });
      return;
    }
    const result = {
      totalAmount: totals?.totalPrice + selectedPrice.shippingFee,
      salePrice: totals?.totalPrice,
      customerPaid: customerPaid > amountDue ? amountDue : customerPaid,
      invoiceType: 1,
      customerId: selectedId,
      storeItems: storeItem,
      note: note,
      shippingFee: selectedPrice.shippingFee,
      address: fullAddress,
      phoneReceive: phone,
      shipperId: selectedShipper.id,
    };

    // If validation passes, proceed with the API call
    try {
      setIsLoadingPayment(true);
      const response = await createQuickPayment(result);

      // Check if the response indicates success
      if (response.data?.success) {
        toast({
          title: "Thanh toán đã được thực hiện thành công.",
          description: "Cảm ơn bạn vì đã chọn mua hàng ở chúng tôi!",
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });
        handleRemoveInvoice(activeInvoiceIndex);
        setIsLoadingPayment(false);
        setSelectedPrice({
          shippingFee: 0,
          totalWeight: 0,
          shippingDistance: 0,
          message: "",
        });
        setCustomerPaid(0);
        setAmountDue(0);
      } else {
        // Handle cases where the response indicates failure
        toast({
          title: "Lỗi",
          description: "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
          variant: "destructive",
        });
        setIsLoadingPayment(false);
        console.error("Unexpected Payment Response:", response);
      }
    } catch (error) {
      // Handle network or unexpected errors
      toast({
        title: "Lỗi",
        description: "Thanh toán thất bại. Vui lòng thử lại.",
        variant: "destructive",
      });
      setIsLoadingPayment(false);
      console.error("Payment failed with exception:", error);
    }
  };
  console.log(activeInvoice);
  return (
    <div className="grid w-full h-full grid-cols-5 grid-rows-1 gap-4">
      <div className="col-span-2">
        <div className="grid h-full grid-cols-1 grid-rows-7 gap-4">
          <div className="row-span-5 h-full p-1 space-y-[1px] overflow-hidden overflow-y-auto scrollbar-thin">
            {activeInvoice?.materials?.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-transparent hover:border-blue-500 flex flex-col justify-between w-full p-2 px-5 h-20 rounded-lg shadow-lg"
              >
                <div className="flex justify-between">
                  <div className="flex gap-5">
                    <h2>{index + 1}</h2>
                    <button
                      onClick={() =>
                        handleRemoveMaterial(item.materialId, item.variantId)
                      }
                    >
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
                        onClick={() =>
                          updateQuantity(item.materialId, item.variantId, false)
                        }
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
                        value={item.number}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.materialId,
                            item.variantId,
                            e.target.value
                          )
                        }
                        className={`flex-shrink-0 border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center ${
                          item.number > item.quantity - item.inOrderQuantity
                            ? "text-red-500"
                            : "text-gray-900 dark:text-white"
                        }`}
                      />

                      {/* Nút tăng */}
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.materialId,
                            item.variantId,

                            true
                          )
                        }
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
                        {(item.materialPrice * item.number).toLocaleString(
                          "vi-VN",
                          {
                            style: "currency",
                            currency: "vnd",
                          }
                        )}
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
                    Tổng tiền hàng: <span>{totals?.totalQuantity}</span>
                  </div>
                  <div className="font-bold">
                    {totals?.totalPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "vnd",
                    })}
                  </div>
                </div>
                {/* <div className="flex justify-between gap-10 mx-5">
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
                </div> */}
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
                  <div className="flex gap-3">
                    <h1 className="font-bold ml-5">CMMS</h1>
                    <div className="flex">
                      <h1>Khách hàng: &nbsp;</h1>
                      <div>
                        {selectedName ? (
                          <h1 className="text-blue-500 underline">
                            {selectedName}
                          </h1>
                        ) : (
                          <h1 className="text-red-500">Chưa chọn</h1>
                        )}
                      </div>
                    </div>
                    <div>
                      <Button
                        className="p-0 h-0"
                        onClick={handleDeleteCus}
                        variant="link"
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
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
                          filteredData.map((item) => (
                            <li
                              key={item.id}
                              className="p-2 hover:bg-blue-100 cursor-pointer"
                              onMouseDown={() => handleSelectItem(item)}
                            >
                              {item.fullName} - {item.email}
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
                    <CreateCustomer />
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
                      onChange={handleNameChange}
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
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-5">
                    <Label className="text-[16px]">Thông tin vận chuyển:</Label>
                    <div className="text-[14px]">
                      <h1>
                        Phí vận chuyển:{" "}
                        <span className="font-bold">
                          {selectedPrice.shippingFee.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "vnd",
                          })}
                        </span>
                      </h1>
                      <h1>
                        Khoảng cách:{" "}
                        <span className="font-bold">
                          {selectedPrice.shippingDistance.toLocaleString(
                            "vi-VN"
                          )}
                          m
                        </span>
                      </h1>
                      {selectedPrice.message !== "" && (
                        <h1>
                          Thông báo:{" "}
                          <span className="font-bold text-red-500">
                            {selectedPrice.message}
                          </span>
                        </h1>
                      )}
                    </div>
                  </div>
                  {isLoadingPrice ? (
                    <Button disabled>
                      <Loader2 className="animate-spin" />
                      Đang lấy...
                    </Button>
                  ) : (
                    <Button
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={handleGetPrice}
                    >
                      {" "}
                      Lấy tiền ship
                    </Button>
                  )}
                </div>
              </div>
              <div className="px-5 py-2">
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
              <div className="flex items-center gap-5 mt-5">
                <h1 className="">Tạo nhân viên giao hàng</h1>
                <CreateShipper />
              </div>
              <h1 className="mt-5">Chọn nhân viên giao hàng</h1>
              <div className="mt-5">
                <Select
                  onValueChange={handleShipChange}
                  value={selectedShipper.id}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Nhân viên">
                      {shippers?.data === null
                        ? "Đang tải..."
                        : selectedShipper.fullName || "Chọn nhân viên"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {shippers?.data?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.fullName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              {isLoadingPayment ? (
                <Button className="text-2xl font-bold w-full py-10" disabled>
                  <Loader2 className="animate-spin" />
                  Đang tải...
                </Button>
              ) : (
                <Button
                  onClick={handlePaymentClick}
                  className="text-2xl font-bold w-full py-10 bg-blue-500 text-white hover:bg-blue-700"
                >
                  Thanh toán
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
