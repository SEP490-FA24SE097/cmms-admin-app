"use client";

import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Check, ChevronsUpDown } from "lucide-react";
import { Loader2 } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import axios from "axios";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { createAccount } from "@/lib/actions/customer/action/customer-action";
import { useQueryClient } from "@tanstack/react-query";

type Location = {
  value: string;
  label: string;
};
export default function CreateCustomer({ isManager }: { isManager?: boolean }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [customerName, setCustomerName] = useState("");
  const [openForm, setForm] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState<string>("");
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);

  const tinh = provinces.find(
    (province) => province.value === selectedProvince
  )?.label;
  const huyen = districts.find(
    (district) => district.value === selectedDistrict
  )?.label;
  const xa = wards.find((ward) => ward.value === selectedWard)?.label;

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
  const handleCreateClick = async () => {
    // Validate address inputs
    if (!customerName) {
      toast({
        title: "Thiếu tên khách hàng",
        description: "Vui lòng nhập tên khách hàng.",
        variant: "destructive",
      });
      return;
    }
    if (!email) {
      toast({
        title: "Thiếu email khách hàng",
        description: "Vui lòng nhập email.",
        variant: "destructive",
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast({
        title: "Email không hợp lệ",
        description: "Vui lòng nhập một địa chỉ email hợp lệ.",
        variant: "destructive",
      });
      return;
    }
    if (!phone) {
      toast({
        title: "Thiếu số điện thoại khách hàng",
        description: "Vui lòng nhập số điện thoại.",
        variant: "destructive",
      });
      return;
    }
    if (!address) {
      toast({
        title: "Địa chỉ không cụ thể",
        description: "Vui lòng nhập địa chỉ.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedProvince) {
      toast({
        title: "Chưa chọn tỉnh/thành phố",
        description: "Vui lòng chọn tỉnh/thành phố.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedDistrict) {
      toast({
        title: "Chưa chọn quận/huyện",
        description: "Vui lòng chọn quận/huyện.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedWard) {
      toast({
        title: "Chưa chọn phường/xã",
        description: "Vui lòng chọn phường/xã.",
        variant: "destructive",
      });
      return;
    }

    const Data = {
      fullName: customerName,
      email: email,
      phoneNumber: phone,
      province: tinh,
      district: huyen,
      ward: xa,
      address: address,
    };
    console.log(Data);
    try {
      setIsLoadingCreate(true);
      const response = await createAccount(Data);
      if (response.success) {
        toast({
          title: "Đăng ký thành công",
          style: { backgroundColor: "#73EC8B", color: "#ffffff" },
        });
        setForm(false);
        queryClient.invalidateQueries({
          queryKey: ["ALL_CUSTOMER"],
        });
      } else if (response.error) {
        toast({
          title: response.error,
          description: "Vui lòng thử lại",
          variant: "destructive",
        });
        setIsLoadingCreate(false);
      }
    } catch (error) {
      toast({
        title: "Đăng ký thật bại",
        description: "Đăng ký thất bại vui lòng thử lại",
        variant: "destructive",
      });
      setIsLoadingCreate(false);
    } finally {
      setIsLoadingCreate(false);
    }
  };
  return (
    <div>
      <HoverCard openDelay={100} closeDelay={200}>
        <HoverCardTrigger>
          {" "}
          <Dialog open={openForm} onOpenChange={setForm}>
            <DialogTrigger asChild>
              <div>
                {isManager ? (
                  <Button className="bg-blue-500 text-white hover:bg-blue-600">
                    <FaPlus size={22} /> Thêm khách hàng
                  </Button>
                ) : (
                  <FaPlus size={22} />
                )}
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-[600px] h-[500px]">
              <DialogOverlay className="bg-white p-5 rounded-md space-y-4">
                <h1 className="text-2xl font-bold">Thêm khách hàng</h1>
                <div className="mt-5 space-y-3">
                  <div className="flex items-center ">
                    <h1 className="w-[30%] font-bold">Tên khách hàng:</h1>
                    <Input
                      className="w-[65%]"
                      placeholder="Họ và tên"
                      value={customerName} // Gắn state vào value
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center">
                    <h1 className="w-[30%] font-bold">Địa chỉ email:</h1>
                    <Input
                      type="email"
                      className="w-[65%]"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center">
                    <h1 className="w-[30%] font-bold">Số điện thoại: </h1>
                    <Input
                      type="tel"
                      className="w-[65%]"
                      placeholder="Số điện thoại"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <h1 className="w-[30%] font-bold">Tỉnh thành:</h1>
                  <div className="w-[65%]">
                    <div className="grid items-center gap-1.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={!!selectedProvince}
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
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="w-[300px] xl:w-[300px] max-h-[300px] overflow-y-auto p-0 z-[100]"
                          align="start"
                        >
                          <DropdownMenuLabel className="p-2">
                            Tìm kiếm tỉnh...
                          </DropdownMenuLabel>
                          {provinces.length > 0 ? (
                            provinces.map((province) => (
                              <DropdownMenuItem
                                key={province.value}
                                onClick={() => {
                                  setSelectedProvince(province.value);
                                  setSelectedDistrict(null); // Reset district and ward when province changes
                                  setSelectedWard(null);
                                }}
                                className="flex px-7 hover:bg-slate-300 items-center justify-between"
                              >
                                {province.label}
                                {selectedProvince === province.value && (
                                  <Check className="ml-2 h-4 w-4" />
                                )}
                              </DropdownMenuItem>
                            ))
                          ) : (
                            <DropdownMenuItem disabled>
                              Không tìm thấy!
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <h1 className="w-[30%] font-bold">Huyện xã:</h1>
                  <div className="w-[65%]">
                    <div className="grid items-center gap-1.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={!!selectedDistrict}
                            className="w-full justify-between"
                            disabled={!selectedProvince} // Enable only after province is selected
                          >
                            {selectedDistrict
                              ? districts.find(
                                  (district) =>
                                    district.value === selectedDistrict
                                )?.label
                              : "Chọn huyện..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="w-[300px] xl:w-[300px] max-h-[300px] overflow-y-auto p-0"
                          align="start"
                        >
                          <DropdownMenuLabel className="p-2">
                            Tìm kiếm huyện...
                          </DropdownMenuLabel>
                          {districts.length > 0 ? (
                            districts.map((district) => (
                              <DropdownMenuItem
                                key={district.value}
                                onClick={() => {
                                  setSelectedDistrict(district.value);
                                  setSelectedWard(null); // Reset ward when district changes
                                }}
                                className="flex px-7 hover:bg-slate-300 items-center justify-between"
                              >
                                {district.label}
                                {selectedDistrict === district.value && (
                                  <Check className="ml-2 h-4 w-4" />
                                )}
                              </DropdownMenuItem>
                            ))
                          ) : (
                            <DropdownMenuItem disabled>
                              Không tìm thấy!
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <h1 className="w-[30%] font-bold">Xã phường:</h1>
                  <div className="w-[65%]">
                    <div className="grid items-center gap-1.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={!!selectedWard}
                            className="w-full justify-between"
                            disabled={!selectedDistrict} // Enable only after district is selected
                          >
                            {selectedWard
                              ? wards.find(
                                  (ward) => ward.value === selectedWard
                                )?.label
                              : "Chọn xã/phường..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="w-[300px] xl:w-[300px] max-h-[300px] overflow-y-auto p-0"
                          align="start"
                        >
                          <DropdownMenuLabel className="p-2">
                            Tìm kiếm xã/phường...
                          </DropdownMenuLabel>
                          {wards.length > 0 ? (
                            wards.map((ward) => (
                              <DropdownMenuItem
                                key={ward.value}
                                onClick={() => setSelectedWard(ward.value)}
                                className="flex px-7 hover:bg-slate-300 items-center justify-between"
                              >
                                {ward.label}
                                {selectedWard === ward.value && (
                                  <Check className="ml-2 h-4 w-4" />
                                )}
                              </DropdownMenuItem>
                            ))
                          ) : (
                            <DropdownMenuItem disabled>
                              Không tìm thấy!
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <h1 className="w-[30%] font-bold">Địa chỉ cụ thể:</h1>
                  <Input
                    type="text"
                    className="w-[65%]"
                    placeholder="Địa chỉ"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="flex justify-center">
                  {isLoadingCreate ? (
                    <Button className="py-7 w-52 text-2xl" disabled>
                      <Loader2 className="animate-spin" />
                      Đang xử lý
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCreateClick}
                      className="py-7 w-52 text-2xl bg-blue-500 hover:bg-blue-600"
                    >
                      Tạo tài khoản
                    </Button>
                  )}
                </div>
              </DialogOverlay>
            </DialogContent>
          </Dialog>
        </HoverCardTrigger>
        <HoverCardContent className="p-2 w-full px-5">
          Thêm khách hàng
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
