import { useGetStaffById } from "@/lib/actions/customer/react-query/customer-query";

export default function StaffDetails({ id }: { id: string }) {
  const data = {
    id: id,
  };
  const { data: item, isLoading: isLoadingItem } = useGetStaffById(data);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 grid-rows-1 gap-10">
        <div className="grid grid-cols-5 grid-rows-1 gap-4 border-b pb-2">
          <h1 className="col-span-2">Mã khách hàng:</h1>
          <h1 className="col-span-3 col-start-3 font-bold">{item?.data?.id}</h1>
        </div>
        <div className="grid grid-cols-5 grid-rows-1 gap-4 border-b pb-2">
          <h1 className="col-span-2">Tên khách hàng:</h1>
          <h1 className="col-span-3 col-start-3 font-bold">
            {item?.data?.fullName}
          </h1>
        </div>
        <div className="grid grid-cols-5 grid-rows-1 gap-4 border-b pb-2">
          <h1 className="col-span-2">Số điện thoại:</h1>
          <h1 className="col-span-3 col-start-3 font-bold">
            {item?.data?.phoneNumber || "Chưa có"}
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-3 grid-rows-1 gap-10">
        <div className="grid grid-cols-5 grid-rows-1 gap-4 border-b pb-2">
          <h1 className="col-span-2">Email:</h1>
          <h1 className="col-span-3 col-start-3 font-bold">
            {item?.data?.email}
          </h1>
        </div>
        <div className="grid grid-cols-5 grid-rows-1 gap-4 border-b pb-2">
          <h1 className="col-span-2">Mã số thuế:</h1>
          <h1 className="col-span-3 col-start-3 font-bold">
            {item?.data?.taxCode || ""}
          </h1>
        </div>
        <div className="grid grid-cols-5 grid-rows-1 gap-4 border-b pb-2">
          <h1 className="col-span-2">Trạng thái:</h1>
          <h1 className="col-span-3 col-start-3 font-bold">
            {item?.data?.customerStatus}
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-3 grid-rows-1 gap-10">
        <div className="grid grid-cols-5 grid-rows-1 gap-4 border-b pb-2">
          <h1 className="col-span-2">Ngày sinh:</h1>
          <h1 className="col-span-3 col-start-3 font-bold">
            {item?.data?.dob}
          </h1>
        </div>
        <div className="grid grid-cols-5 grid-rows-1 gap-4 border-b pb-2">
          <h1 className="col-span-2">Tạo bởi:</h1>
          <h1 className="col-span-3 col-start-3 font-bold">
            {item?.data?.createByName}
          </h1>
        </div>
        <div className="grid grid-cols-5 grid-rows-1 gap-4 border-b pb-2"></div>
      </div>
      <div className="flex gap-5 border-b pb-2">
        <h1>Địa chỉ:</h1>
        <h1 className="font-semibold">
          {item?.data?.address}, {item?.data?.ward}, {item?.data?.district},{" "}
          {item?.data?.province}
        </h1>
      </div>
    </div>
  );
}
