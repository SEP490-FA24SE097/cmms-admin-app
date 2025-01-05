import { Customer } from "@/lib/actions/customer/type/customer";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { FaSave } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { UpdateCustomerC } from "@/lib/actions/customer/action/customer-action";
import { useQueryClient } from "@tanstack/react-query";
type Location = {
  value: string;
  label: string;
};

export default function UpdateCustomer({ item }: { item: Customer }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [openProvince, setOpenProvince] = useState(false);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [openWard, setOpenWard] = useState(false);
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
  const [customer, setCustomer] = useState({
    fullName: item.fullName,
    email: item.email,
    phoneNumber: item.phoneNumber || "",
    province: "",
    district: "",
    ward: "",
    address: "",
    taxCode: item.taxCode || "",
    note: "",
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  if (!item) return <div>Đang tải....</div>;

  const handleUpdateClick = async () => {
    if (!customer.province) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn tỉnh.",
        variant: "destructive",
      });
      return;
    }

    if (!customer.district) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn quận/huyện.",
        variant: "destructive",
      });
      return;
    }

    if (!customer.ward) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn phường/xã.",
        variant: "destructive",
      });
      return;
    }

    const data = {
      id: item.id,
      fullName: customer.fullName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      province: customer.province,
      district: customer.district,
      ward: customer.ward,
      address: customer.address,
      taxCode: customer.taxCode,
      note: customer.note,
    };

    try {
      setIsLoading(true);
      const result = await UpdateCustomerC(data);
      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đơn vị mới đã được tạo thành công.",
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });

        queryClient.invalidateQueries({
          queryKey: ["ALL_CUSTOMER"],
        });
      } else {
        toast({
          title: "Lỗi",
          description: result.error || "Có lỗi xảy ra vui lòng thử lại.",
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
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex font-bold text-xl">
        <h1>Khác hàng </h1>
        <h1>{item.id}</h1>
      </div>
      <div className="mt-5 space-y-5">
        <div className="grid grid-cols-2 grid-rows-1 gap-10">
          <div className="grid grid-cols-5 grid-rows-1 gap-4">
            <div className="col-span-2 font-bold">Tên khách hàng:</div>
            <div className="col-span-3 col-start-3">
              <input
                className="border-b w-full hover:border-b-green-500 focus:outline-none focus:border-b-green-500 "
                type="text"
                name="fullName"
                value={customer.fullName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-5 grid-rows-1 gap-4">
            <div className="col-span-2 font-bold">Email:</div>
            <div className="col-span-3 col-start-3">
              <input
                className="border-b w-full hover:border-b-green-500 focus:outline-none focus:border-b-green-500 "
                type="email"
                name="email"
                value={customer.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 grid-rows-1 gap-10">
          <div className="grid grid-cols-5 grid-rows-1 gap-4">
            <div className="col-span-2 font-bold">Số điện thoại:</div>
            <div className="col-span-3 col-start-3">
              <input
                className="border-b w-full hover:border-b-green-500 focus:outline-none focus:border-b-green-500 "
                type=""
                name="phoneNumber"
                value={customer.phoneNumber ?? ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-5 grid-rows-1 gap-4">
            <div className="col-span-2 font-bold">Mã số thuế:</div>
            <div className="col-span-3 col-start-3">
              <input
                className="border-b w-full hover:border-b-green-500 focus:outline-none focus:border-b-green-500 "
                type="text"
                name="taxCode"
                value={customer.taxCode}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 grid-rows-1 gap-10">
          <div className="grid grid-cols-5 grid-rows-1 gap-4 items-center">
            <div className="col-span-2 font-bold">Tỉnh thành:</div>
            <div className="col-span-3 col-start-3">
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
                          (province) => province.value === selectedProvince
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
                          setSelectedDistrict(null);
                          setSelectedWard(null);
                          setCustomer((prevCustomer) => ({
                            ...prevCustomer,
                            province: province.label,
                          }));
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

          <div className="grid grid-cols-5 grid-rows-1 gap-4 items-center">
            <div className="col-span-2 font-bold">Huyện xã:</div>
            <div className="col-span-3 col-start-3">
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
                          (district) => district.value === selectedDistrict
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
                          setSelectedWard(null);
                          setCustomer((prevCustomer) => ({
                            ...prevCustomer,
                            district: district.label,
                          }));
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
        <div className="grid grid-cols-2 grid-rows-1 gap-10">
          <div className="grid grid-cols-5 grid-rows-1 gap-4 items-center">
            <div className="col-span-2 font-bold">Xã phường:</div>
            <div className="col-span-3 col-start-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={!!selectedWard}
                    className="w-full justify-between"
                    disabled={!selectedDistrict}
                  >
                    {selectedWard
                      ? wards.find((ward) => ward.value === selectedWard)?.label
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
                        onClick={() => {
                          setSelectedWard(ward.value);
                          setCustomer((prevCustomer) => ({
                            ...prevCustomer,
                            ward: ward.label,
                          }));
                        }}
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

          <div className="grid grid-cols-5 grid-rows-1 gap-4 items-center">
            <div className="col-span-2 font-bold">Địa chỉ:</div>
            <div className="col-span-3 col-start-3">
              <input
                className="border-b w-full hover:border-b-green-500 focus:outline-none focus:border-b-green-500 "
                type="text"
                name="address"
                value={customer.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="col-span-2 font-bold w-[100px]">Ghi chú:</div>
          <div className="col-span-3 col-start-3 w-full">
            <input
              className="border-b w-full hover:border-b-green-500 focus:outline-none focus:border-b-green-500 "
              type="text"
              name="note"
              value={customer.note}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      <div className="flex mt-10 justify-end">
        {isLoading ? (
          <Button className="" disabled>
            <Loader2 className="animate-spin" />
            Đang xử lý
          </Button>
        ) : (
          <Button
            onClick={handleUpdateClick}
            className="bg-green-500 text-white hover:bg-green-600"
          >
            <FaSave /> Cập nhật thông tin
          </Button>
        )}
      </div>
    </div>
  );
}
