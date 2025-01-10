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
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Check, ChevronsUpDown } from "lucide-react";

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
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  createAccount,
  createAccountStaff,
} from "@/lib/actions/customer/action/customer-action";
import { useGetStore } from "@/lib/actions/store/react-query/store-query";
import { useQueryClient } from "@tanstack/react-query";
import { useRole } from "@/providers/role-context";

type Location = {
  value: string;
  label: string;
};
export default function AddStaff() {
  const { toast } = useToast();
  const { role } = useRole();
  const queryClient = useQueryClient();
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [staffRole, setStaffRole] = useState("6");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState<string>("");
  const [usename, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [openForm, setForm] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState({ id: "", name: "" });
  const { data: stores, isLoading: isLoadingStore } = useGetStore();
  const handleStoreChange = (value: any) => {
    const selectedStoreObject = stores?.data.find((item) => item.id === value);
    setSelectedStore(selectedStoreObject || { id: "", name: "" }); // Handle potential missing store
  };
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
      storeId: selectedStore.id,
      username: usename,
      password: password,
      staffRole: staffRole,
    };

    try {
      setIsLoadingCreate(true);
      const response = await createAccountStaff(Data);
      if (response.success) {
        toast({
          title: "Đăng ký thành công",
          style: { backgroundColor: "#73EC8B", color: "#ffffff" },
        });
        setForm(false);
        queryClient.invalidateQueries({
          queryKey: ["Staff_LIST"],
        });
        setPassword("");
        setProvinces([]);
        setDistricts([]);
        setWards([]);
        setAddress("");
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
  const handleRoleChange = (value: any) => {
    setStaffRole(value);
  };
  return (
    <div>
      <HoverCard openDelay={100} closeDelay={200}>
        <HoverCardTrigger>
          {" "}
          <Dialog open={openForm} onOpenChange={setForm}>
            <DialogTrigger asChild>
              <div>
                <Button className="bg-blue-500 text-white hover:bg-blue-600">
                  <FaPlus size={22} /> Thêm nhân viên
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent>
              <div className="flex gap-5">
                <h1 className="text-2xl font-bold">Thêm nhân viên</h1>
                <Select value={staffRole} onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Chọn nhân viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {role === "Senior_Management" && (
                      <SelectItem value="2">Quản lý</SelectItem>
                    )}
                    <SelectItem value="3">Bán hàng</SelectItem>
                    <SelectItem value="6">Vận chuyển</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-2 space-y-3">
                <div className="flex items-center ">
                  <h1 className="w-[30%] font-bold">Tên nhân viên:</h1>
                  <Input
                    className="w-[65%]"
                    placeholder="Họ và tên"
                    value={customerName} // Gắn state vào value
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="flex items-center">
                  <h1 className="w-[30%] font-bold">Tên đăng nhập:</h1>
                  <Input
                    type="text"
                    className="w-[65%]"
                    placeholder="Tên đăng nhâp"
                    value={usename}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="flex items-center">
                  <h1 className="w-[30%] font-bold">Mật khẩu:</h1>
                  <Input
                    type="password"
                    className="w-[65%]"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <h1 className="w-[30%] font-bold">Chọn cửa hàng</h1>
                <div className="w-[65%]">
                  <Select
                    onValueChange={handleStoreChange}
                    value={selectedStore.id}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Cửa hàng">
                        {stores?.data === null
                          ? "Đang tải..."
                          : selectedStore.name || "Chọn cửa hàng"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {stores?.data?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
                        className="w-[300px] xl:w-[300px] max-h-[300px] overflow-y-auto p-0"
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
                            ? wards.find((ward) => ward.value === selectedWard)
                                ?.label
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
              {isLoadingCreate ? (
                <Button className="py-7 w-52 mx-auto text-2xl" disabled>
                  <Loader2 className="animate-spin" />
                  Đang xử lý
                </Button>
              ) : (
                <Button
                  onClick={handleCreateClick}
                  className="py-7 w-52 mx-auto text-2xl bg-blue-500 hover:bg-blue-600"
                >
                  Tạo tài khoản
                </Button>
              )}
            </DialogContent>
          </Dialog>
        </HoverCardTrigger>
        <HoverCardContent className="p-2 w-full px-5">
          Thêm nhân viên
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
