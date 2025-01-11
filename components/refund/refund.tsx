"use client";

import { useEffect, useState } from "react";

import { RiDeleteBin5Line } from "react-icons/ri";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { Textarea } from "@/components/ui/textarea";

import { FaUserCircle } from "react-icons/fa";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

import { useReturnInvoiceContext } from "@/context/refund-context";
import { CreateRefund } from "@/lib/actions/invoices/action/invoice-action";
import { Loader2 } from "lucide-react";
interface StoreItem {
  materialId: string;
  quantity: number;
  number: number;
  variantId: string | null;
  img: string | null;
  name: string;
  salePrice: number;
}
export default function RefundHome() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const storeId = session?.user.user.storeId;

  const {
    returnInvoices,
    activeReturnInvoiceIndex,
    setActiveReturnInvoiceIndex,
    handleAddReturnInvoice,
    handleDeleteReturnInvoice,
  } = useReturnInvoiceContext();
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
  const activeInvoice = returnInvoices[activeReturnInvoiceIndex];
  const [storeItem, setStoreItem] = useState<StoreItem[]>([]);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [note, setNote] = useState<string>("");

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(event.target.value);
  };
  useEffect(() => {
    const quantity = storeItem.reduce((acc, item) => acc + item.quantity, 0);
    const price = storeItem.reduce(
      (acc, item) => acc + item.salePrice * item.quantity,
      0
    );

    setTotalQuantity(quantity);
    setTotalPrice(price);
  }, [storeItem]);
  useEffect(() => {
    if (!returnInvoices || returnInvoices.length === 0) {
      setStoreItem([]);
    } else if (activeInvoice?.invoices?.invoiceDetails) {
      const items: StoreItem[] = activeInvoice.invoices.invoiceDetails.map(
        (item) => ({
          materialId: item.materialId,
          quantity: 0,
          number: item.quantity,
          variantId: item.variantId,
          img: item.imageUrl,
          name: item.itemName,
          salePrice: item.salePrice,
        })
      );
      setStoreItem(items);
    }
  }, [returnInvoices, activeInvoice]);

  const handleDeleteQuantity = (
    materialId: string,
    variantId: string | null
  ) => {
    setStoreItem((prevItems) =>
      prevItems.map((item) =>
        item.materialId === materialId && item.variantId === variantId
          ? { ...item, quantity: 0 }
          : item
      )
    );
  };
  const handleIncreaseQuantity = (
    materialId: string,
    variantId: string | null
  ) => {
    setStoreItem((prevItems) =>
      prevItems.map((item) =>
        item.materialId === materialId && item.variantId === variantId
          ? { ...item, quantity: Math.min(item.quantity + 1, item.number) }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (
    materialId: string,
    variantId: string | null
  ) => {
    setStoreItem((prevItems) =>
      prevItems.map((item) =>
        item.materialId === materialId && item.variantId === variantId
          ? { ...item, quantity: Math.max(item.quantity - 1, 0) }
          : item
      )
    );
  };
  const handleUpdateQuantity = (
    materialId: string,
    variantId: string | null,
    value: number
  ) => {
    setStoreItem((prevItems) =>
      prevItems.map((item) =>
        item.materialId === materialId && item.variantId === variantId
          ? { ...item, quantity: Math.max(0, Math.min(value, item.number)) }
          : item
      )
    );
  };
  const refundItem = storeItem?.map((item, index) => ({
    materialId: item.materialId,
    quantity: item.number,
    variantId: item.variantId,
  }));
  const [isLoadingRefund, setIdLoadingRefund] = useState(false);
  const handleRefundClick = async () => {
    const result = {
      reason: note,
      invoiceId: activeInvoice.invoices.id,
      shippingDate: now,
      updateType: 1,
      refundItems: refundItem,
    };

    // If validation passes, proceed with the API call
    try {
      setIdLoadingRefund(true);
      const response = await CreateRefund(result);

      // Check if the response indicates success
      if (response?.success) {
        toast({
          title: "Hoàn trả đã được thực hiện thành công.",
          description: "Cảm ơn bạn vì đã chọn mua hàng ở chúng tôi!",
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });

        handleDeleteReturnInvoice(activeInvoice.id);
        setIdLoadingRefund(false);
        // // Redirect to the home page after a short delay
        // setTimeout(() => {
        //   window.location.href = "/home";
        // }, 2000);
      } else {
        toast({
          title: "Lỗi",
          description: "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
          variant: "destructive",
        });
        setIdLoadingRefund(false);
        console.error("Unexpected Payment Response:", response);
      }
    } catch (error) {
      // Handle network or unexpected errors
      toast({
        title: "Lỗi",
        description: "Thanh toán thất bại. Vui lòng thử lại.",
        variant: "destructive",
      });
      setIdLoadingRefund(false);
      console.error("Payment failed with exception:", error);
    }
  };

  return (
    <div className="grid h-full grid-cols-10 grid-rows-1">
      <div className="col-span-7 mr-1">
        <div className="grid h-full grid-cols-1 grid-rows-7 gap-4">
          <div className="row-span-6 p-1 space-y-[1px] overflow-hidden overflow-y-auto">
            {storeItem?.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-transparent hover:border-blue-500 flex flex-col justify-between w-full p-2 px-5 h-20 rounded-lg shadow-lg"
              >
                <div className="flex justify-between">
                  <div className="flex gap-5">
                    <h2>{index + 1}</h2>
                    <button
                      onClick={() =>
                        handleDeleteQuantity(item.materialId, item.variantId)
                      }
                    >
                      <RiDeleteBin5Line size={20} />
                    </button>
                    <img
                      src={item.img || ""}
                      className="h-10 w-15 object-cover"
                      alt=""
                    />
                    <h2 className="ml-5 capitalize">{item.name}</h2>
                  </div>
                  <div className="p-1 hover:p-1 hover:rounded-full hover:bg-slate-300">
                    <PiDotsThreeOutlineVerticalFill size={20} />
                  </div>
                </div>

                <div className="grid grid-cols-5 grid-rows-1 gap-4">
                  <div className="col-span-2">
                    <div className="flex justify-center items-center">
                      <button
                        type="button"
                        onClick={() =>
                          handleDecreaseQuantity(
                            item.materialId,
                            item.variantId
                          )
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

                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value, 10) || 0;
                          handleUpdateQuantity(
                            item.materialId,
                            item.variantId,
                            newValue
                          );
                        }}
                        className={`flex-shrink-0 border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center ${
                          item.quantity > item.number
                            ? "text-red-500"
                            : "text-gray-900 dark:text-white"
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handleIncreaseQuantity(
                            item.materialId,
                            item.variantId
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
                      <div className="text-slate-500 ml-2"> /{item.number}</div>
                    </div>
                  </div>

                  <div className="col-span-3 col-start-3">
                    <div className="flex gap-10 justify-center items-center">
                      <div className="w-32 border-b text-end">
                        {item.salePrice?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "vnd",
                        })}
                      </div>
                      <div className="font-bold">
                        {(item.salePrice * item.quantity).toLocaleString(
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
          <div className="row-start-7">
            <div className="bg-white h-full rounded-lg shadow-lg grid grid-cols-5 grid-rows-1 gap-4">
              <div className="col-span-3 ml-2 my-auto">
                <Textarea
                  value={note}
                  onChange={handleNoteChange}
                  placeholder="Nhập ghi chú vào đây"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-4 h-full bg-white col-start-8 p-5 rounded-lg shadow-lg">
        <div className="flex h-full flex-col justify-between">
          <div className="font-semibold">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-600"></div>
              <div className="text-sm text-gray-600">
                {formattedDate} {formattedTime}
              </div>
            </div>
            <div className="flex items-center mb-4">
              <FaUserCircle className="text-2xl text-gray-600 mr-2" />
              <div className="text-blue-600">
                {activeInvoice?.invoices?.userVM.fullName || ""}
              </div>
            </div>
            <div className="mb-4">
              <div className="text-green-600 font-bold">Trả hàng</div>
              <div className="text-blue-600">
                / {activeInvoice?.invoices.id} -{" "}
                {activeInvoice?.invoices.staffName} -{" "}
                {activeInvoice?.invoices.staffId}
              </div>
            </div>

            <div className="mb-2 flex justify-between">
              <div className="text-gray-800">Tổng tiền hàng trả</div>
              <div className="text-gray-800">
                {totalPrice.toLocaleString("vi-VN")}
              </div>
            </div>
            <div className="mb-2 flex justify-between">
              <div className="text-gray-800">Tổng sản phẩm hoàn trả</div>
              <div className="text-gray-800">{totalQuantity}</div>
            </div>
            <div className="mb-4 flex justify-between">
              <div className="text-gray-800">Cần trả khách</div>
              <div className="text-blue-600">
                {totalPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "vnd",
                })}
              </div>
            </div>
          </div>
          <div>
            {isLoadingRefund ? (
              <Button disabled className="w-full py-10 text-2xl font-bold py-5">
                <Loader2 />
                TRẢ HÀNG
              </Button>
            ) : (
              <Button
                onClick={handleRefundClick}
                className="w-full text-2xl py-10 font-bold bg-blue-500  text-white hover:bg-blue-600"
              >
                TRẢ HÀNG
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
