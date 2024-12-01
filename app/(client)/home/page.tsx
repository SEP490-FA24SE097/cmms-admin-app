"use client";
import HeaderSeler from "@/components/seller/header/page";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { RiDeleteBin5Line } from "react-icons/ri";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { Textarea } from "@/components/ui/textarea";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState<string>(""); // Chuỗi nhập vào
  const [filteredData, setFilteredData] = useState<string[]>([]); // Mảng chuỗi
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // Boolean

  const data: string[] = [
    "Sản phẩm 1",
    "Sản phẩm 2",
    "Sản phẩm 3",
    "Sản phẩm 4",
  ];

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
  return (
    <div className="grid h-screen grid-cols-1 grid-rows-12 gap-0 bg-slate-100">
      <div>
        <HeaderSeler />
      </div>
      <div className="row-span-11 p-4">
        <div className="grid h-full grid-cols-10 grid-rows-1">
          <div className="col-span-6 mr-1">
            <div className="grid h-full grid-cols-1 grid-rows-7 gap-4">
              <div className="row-span-6 p-1 space-y-[1px] overflow-hidden overflow-y-auto">
                <div className="bg-white border border-transparent hover:border-blue-500 flex flex-col justify-between w-full p-2 px-5 h-20 rounded-lg shadow-lg">
                  <div className="flex justify-between">
                    <div className="flex gap-5">
                      <h2>1</h2>
                      <RiDeleteBin5Line size={20} />
                      <h2>SP00001</h2>
                      <h2 className="ml-5">Vòi lavabo lạnh bán tự động</h2>
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
                          id="decrement-button"
                          data-input-counter-decrement="counter-input"
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
                          type="text"
                          id="counter-input"
                          data-input-counter
                          className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                          placeholder=""
                          value="12"
                          required
                        />
                        <button
                          type="button"
                          id="increment-button"
                          data-input-counter-increment="counter-input"
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
                        <div className="w-32 border-b text-end">123</div>
                        <div className="font-bold">123</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row-start-7">
                <div className="bg-white h-full rounded-lg shadow-lg grid grid-cols-5 grid-rows-1 gap-4">
                  <div className="col-span-3 ml-2 my-auto">
                    <Textarea placeholder="Nhập ghi chú vào đây" />
                  </div>
                  <div className="col-span-2 h-full col-start-4">
                    <div className="flex justify-end h-full items-center gap-10 mx-5">
                      <div>
                        Tổng tiền hàng: <span>2</span>
                      </div>
                      <div className="font-bold">100000d</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-5 h-full bg-white col-start-7 rounded-lg shadow-lg">
            <div className="grid h-full grid-cols-1 grid-rows-8 gap-4 p-3">
              <div className="">
                <div className="flex justify-between items-center">
                  <div className="relative w-[80%]">
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
                  <div className="flex items-center">
                    <Sheet>
                      <SheetTrigger>
                        <HoverCard openDelay={100} closeDelay={200}>
                          <HoverCardTrigger>
                            <div className="p-2 rounded-full hover:bg-blue-800">
                              <CiFilter size={22} />
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent className="p-2 w-full px-5">
                            Lọc hàng hóa
                          </HoverCardContent>
                        </HoverCard>
                      </SheetTrigger>
                      <SheetContent className="w-[400px] sm:w-[540px]">
                        <SheetHeader>
                          <SheetTitle>Lọc hàng hóa</SheetTitle>
                          <SheetDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                          </SheetDescription>
                        </SheetHeader>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </div>
              <div className="row-span-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
                  {[
                    {
                      title: "Quầy tiếp tân Mộc Thành",
                      price: "6,500,000",
                      img: "https://storage.googleapis.com/a1aa/image/8FMTMAVpyApZDNtrlrQdKijENkom6zWLAgVrQJ7eyEI5RF7JA.jpg",
                    },
                    {
                      title: "Bàn giám đốc",
                      price: "8,900,000",
                      img: "https://storage.googleapis.com/a1aa/image/uRg08htLYFJeOSw9gzDvJSwFSaDAQN5SENXMjDy9BcD6RF7JA.jpg",
                    },
                    {
                      title: "Ghế xoay trắng Trinh Thiên",
                      price: "1,389,500",
                      img: "https://storage.googleapis.com/a1aa/image/QIKCF8TTJOalPFee7WcBme9esGjV6ZO1pgTViVeAdNLWdUxeE.jpg",
                    },
                    {
                      title: "Quầy tiếp tân Mộc Thành",
                      price: "6,500,000",
                      img: "https://storage.googleapis.com/a1aa/image/8FMTMAVpyApZDNtrlrQdKijENkom6zWLAgVrQJ7eyEI5RF7JA.jpg",
                    },
                    {
                      title: "Bàn giám đốc",
                      price: "8,900,000",
                      img: "https://storage.googleapis.com/a1aa/image/uRg08htLYFJeOSw9gzDvJSwFSaDAQN5SENXMjDy9BcD6RF7JA.jpg",
                    },
                    {
                      title: "Ghế xoay trắng Trinh Thiên",
                      price: "1,389,500",
                      img: "https://storage.googleapis.com/a1aa/image/QIKCF8TTJOalPFee7WcBme9esGjV6ZO1pgTViVeAdNLWdUxeE.jpg",
                    },
                    {
                      title: "Quầy tiếp tân Mộc Thành",
                      price: "6,500,000",
                      img: "https://storage.googleapis.com/a1aa/image/8FMTMAVpyApZDNtrlrQdKijENkom6zWLAgVrQJ7eyEI5RF7JA.jpg",
                    },
                    {
                      title: "Bàn giám đốc",
                      price: "8,900,000",
                      img: "https://storage.googleapis.com/a1aa/image/uRg08htLYFJeOSw9gzDvJSwFSaDAQN5SENXMjDy9BcD6RF7JA.jpg",
                    },
                    {
                      title: "Ghế xoay trắng Trinh Thiên",
                      price: "1,389,500",
                      img: "https://storage.googleapis.com/a1aa/image/QIKCF8TTJOalPFee7WcBme9esGjV6ZO1pgTViVeAdNLWdUxeE.jpg",
                    },
                    {
                      title: "Quầy tiếp tân Mộc Thành",
                      price: "6,500,000",
                      img: "https://storage.googleapis.com/a1aa/image/8FMTMAVpyApZDNtrlrQdKijENkom6zWLAgVrQJ7eyEI5RF7JA.jpg",
                    },
                    {
                      title: "Bàn giám đốc",
                      price: "8,900,000",
                      img: "https://storage.googleapis.com/a1aa/image/uRg08htLYFJeOSw9gzDvJSwFSaDAQN5SENXMjDy9BcD6RF7JA.jpg",
                    },
                    {
                      title: "Ghế xoay trắng Trinh Thiên",
                      price: "1,389,500",
                      img: "https://storage.googleapis.com/a1aa/image/QIKCF8TTJOalPFee7WcBme9esGjV6ZO1pgTViVeAdNLWdUxeE.jpg",
                    },
                    {
                      title: "Quầy tiếp tân Mộc Thành",
                      price: "6,500,000",
                      img: "https://storage.googleapis.com/a1aa/image/8FMTMAVpyApZDNtrlrQdKijENkom6zWLAgVrQJ7eyEI5RF7JA.jpg",
                    },
                    {
                      title: "Bàn giám đốc",
                      price: "8,900,000",
                      img: "https://storage.googleapis.com/a1aa/image/uRg08htLYFJeOSw9gzDvJSwFSaDAQN5SENXMjDy9BcD6RF7JA.jpg",
                    },
                    {
                      title: "Ghế xoay trắng Trinh Thiên",
                      price: "1,389,500",
                      img: "https://storage.googleapis.com/a1aa/image/QIKCF8TTJOalPFee7WcBme9esGjV6ZO1pgTViVeAdNLWdUxeE.jpg",
                    },
                    // Add more products here...
                  ].map((product, index) => (
                    <div
                      className="flex items-center px-2 py-1 rounded-md border border-transparent hover:border-blue-600 hover:border"
                      key={index}
                    >
                      <img
                        src={product.img}
                        alt={product.title}
                        className="w-14 h-14 object-cover "
                        width={60}
                        height={60}
                      />
                      <div className="ml-2 h-full justify-between flex flex-col">
                        <div className="text-[14px]">{product.title}</div>
                        <div className="text-blue-600 font-bold">
                          {product.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="row-start-8">
                <div className="flex items-center justify-between">
                  <div>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext href="#" />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                  <div>
                    <Button className=" bg-blue-600 px-20 py-7 text-2xl font-bold text-white hover:bg-blue-700">
                      Thanh toán
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row-start-13">
        <HeaderSeler />
      </div>
    </div>
  );
}
