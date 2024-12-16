"use client"
import ManagerHeader from "@/components/manager/header/page";
import { Button } from "@/components/ui/button"
import NavHeader from "@/components/manager/nav-header/page";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useState } from "react";
import MaterialDetails from "@/components/manager/material-tab/material-detail";
import MaterialTrackingHistory from "@/components/manager/material-tab/material-tracking-history";
import { useGetMaterial } from "@/lib/actions/materials/react-query/material-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ManageMaterialPage() {

  const searchParams = {
    page: 1,
    itemPerPage: 10
  }



  const { data: materials, isLoading: isLoadingMaterails } = useGetMaterial(searchParams);
  console.log(materials)

  const [isActive, setIsActive] = useState("chitiet");

  return (

    <div className="h-[100vh] grid grid-cols-1 grid-rows-10 gap-4">
      <div>
        <ManagerHeader />
        <NavHeader />
      </div>
      <div className="row-span-9 mt-3 w-[80%] mx-auto">
        <div className="">
          <div className="grid grid-cols-12 gap-4 mt-3">
            <div className="col-span-3 text-xl font-semibold" >
              Hàng hóa
            </div>
            <div className="col-span-9 grid grid-cols-2 justify-between">
              <div className="w-full">
                <form className="max-w-md">
                  <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Tìm kiếm</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                      </svg>
                    </div>
                    <input type="search" name="n" id="default-search"
                      className="block w-full py-1 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Nhập tên hàng hóa" required />
                  </div>
                </form>
              </div>

              <div className="flex justify-end align-middle">
                <Dialog>
                  <DialogTrigger>
                    <Button className="bg-green-600 text-white hover:bg-green-700 hover:text-white px-4 mx-2 transition-colors" variant="outline">Thêm mới</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

                <Button className="bg-green-600 text-white hover:bg-green-700 hover:text-white px-4 mx-2 transition-colors" variant="outline">Import</Button>
                <Button className="bg-green-600 text-white hover:bg-green-700 hover:text-white px-4 mx-2 transition-colors" variant="outline">Xuất file</Button>
                <Button className="bg-green-600 text-white hover:bg-green-700 hover:text-white px-4 mx-2 transition-colors" variant="outline">....</Button>
              </div>

            </div>
          </div>

          {/* Table content */}

          <div className="grid grid-cols-12 gap-4 mt-3">
            <div className="col-span-3 w-full bg-green-300">
              Sider bar
            </div>
            <div className="col-span-9">
              <div className="grid grid-cols-8 bg-green-50">
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
                <div>5</div>
                <div>6</div>
                <div>7</div>
                <div>8</div>
              </div>


              {materials?.data.map((item) => (
                <div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="grid grid-cols-8">
                        <div>{item.material.name}</div>
                        <div>{item.material.barCode}</div>
                        <div>{item.material.brand}</div>
                        <div>{item.material.description}</div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div>
                          <Button onClick={() => setIsActive("chitiet")} >Tab 1  </Button>
                          <Button onClick={() => setIsActive("tracking")}>Tab 2 </Button>
                        </div>
                        <div>
                          {
                            isActive === "chitiet" ? <MaterialDetails /> : <MaterialTrackingHistory />
                          }
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              ))}



            </div>
          </div>

        </div>

      </div>
    </div >

  );
}