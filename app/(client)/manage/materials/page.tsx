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
import { useState, ChangeEvent, FormEvent } from "react";
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
import { useGetCategory } from "@/lib/actions/materials-fields/react-query/category-query";
import { useGetUnit } from "@/lib/actions/materials-fields/react-query/unit-query";
import { useGetBrand } from "@/lib/actions/materials-fields/react-query/brand-query";

export default function ManageMaterialPage() {
  const searchParams = {
    page: 1,
    itemPerPage: 10
  }


  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    name: '',
    costPrice: 0,
    salePrice: 0,
    imagesFile: [] as File[],
    weightValue: 0,
    description: '',
    minStock: 0,
    maxStock: 0,
    basicUnitId: '',
    materialUnitDtoList: [
      {
        unitId: '',
        conversionRate: 0,
        price: 0,
      },
    ],
    categoryId: '',
    brandId: '',
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement; // Chắc chắn nó là checkbox
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({ ...prev, imagesFile: files }));
    }
  };

  const handleMaterialUnitChange = (index: number, field: string, value: any) => {
    const updatedUnits = [...formData.materialUnitDtoList];
    updatedUnits[index] = { ...updatedUnits[index], [field]: value };
    setFormData((prev) => ({ ...prev, materialUnitDtoList: updatedUnits }));
  };

  const addMaterialUnit = () => {
    setFormData((prev) => ({
      ...prev,
      materialUnitDtoList: [
        ...prev.materialUnitDtoList,
        { unitId: '', conversionRate: 0, price: 0 },
      ],
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitted Data:', formData);
  };


  const { data: materials, isLoading: isLoadingMaterails } = useGetMaterial(searchParams);
  const { data: categories, isLoading: isLoadingCategories } = useGetCategory();
  const { data: units, isLoading: isLoadingUnits } = useGetUnit();
  const { data: brands, isLoading: isLoadingBrands } = useGetBrand();

  console.log('cate', categories);
  console.log('unit', units);
  console.log('brand', brands);


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


              {/* Add new Material */}
              <div className="flex justify-end align-middle">
                <Dialog>
                  <DialogTrigger>
                    <Button className="bg-green-600 text-white hover:bg-green-700 hover:text-white px-4 mx-2 transition-colors" variant="outline">Thêm mới</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[960px]">
                    <DialogHeader>
                      <DialogDescription>
                        <div className="bg-white max-w-4xl rounded-lg shadow-lg p-6">
                          {/* Header */}
                          <div className="flex justify-between items-center border-b pb-4 mb-4">
                            <h2 className="text-xl font-semibold text-black">Thêm hàng</h2>
                          </div>

                          {/* Form */}
                          <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-gray-900">Tên hàng</label>
                                <input
                                  name="name"
                                  type="text"
                                  value={formData.name}
                                  onChange={handleChange}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>

                              <div>
                                <label className="block text-gray-900">Giá vốn</label>
                                <input
                                  name="costPrice"
                                  type="number"
                                  value={formData.costPrice}
                                  onChange={handleChange}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>

                              <div>
                                <label className="block text-gray-900">Giá bán</label>
                                <input
                                  name="salePrice"
                                  type="number"
                                  value={formData.salePrice}
                                  onChange={handleChange}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>

                              <div>
                                <label className="block text-gray-900">Tồn kho tối thiểu</label>
                                <input
                                  name="minStock"
                                  type="number"
                                  value={formData.minStock}
                                  onChange={handleChange}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>

                              <div>
                                <label className="block text-gray-900">Tồn kho tối đa</label>
                                <input
                                  name="maxStock"
                                  type="number"
                                  value={formData.maxStock}
                                  onChange={handleChange}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>

                              <div className="col-span-2">
                                <label className="block text-gray-900">Hình ảnh</label>
                                <input
                                  type="file"
                                  multiple
                                  onChange={handleImageChange}
                                  className="w-full border rounded px-3 py-2"
                                />
                                <div className="flex space-x-2 mt-2">
                                  {formData.imagesFile.map((image, index) => (
                                    <img
                                      key={index}
                                      src={URL.createObjectURL(image)}
                                      alt="Selected"
                                      className="w-20 h-20 object-cover border rounded"
                                    />
                                  ))}

                                </div>
                              </div>


                              <div>
                                <label htmlFor="category" className="block text-gray-900 mb-1">
                                  Chọn nhóm hàng
                                </label>
                                <select
                                  name="categoryId"
                                  id="category"
                                  value={formData.categoryId}
                                  onChange={handleChange}
                                  className="w-full border rounded px-3 py-2"
                                >
                                  <option value="">-- Chọn nhóm hàng --</option>
                                  {categories?.data.map((cate) => (
                                    <option key={cate.id} value={cate.id}>
                                      {cate.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Unit Dropdown */}
                              <div>
                                <label htmlFor="basicUnitId" className="block text-gray-900 mb-1">
                                  Chọn đơn vị tính
                                </label>
                                <select
                                  name="basicUnitId"
                                  id="basicUnitId"
                                  value={formData.basicUnitId}
                                  onChange={handleChange}
                                  className="w-full border rounded px-3 py-2"
                                >
                                  <option value="">-- Chọn đơn vị tính --</option>
                                  {units?.data.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                      {unit.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Brand Dropdown */}
                              <div>
                                <label htmlFor="brandId" className="block text-gray-900 mb-1">
                                  Chọn thương hiệu
                                </label>
                                <select
                                  name="brandId"
                                  id="brandId"
                                  value={formData.brandId}
                                  onChange={handleChange}
                                  className="w-full border rounded px-3 py-2"
                                >
                                  <option value="">-- Chọn thương hiệu --</option>
                                  {brands?.data.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                      {brand.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="col-span-2">
                                <label className="block text-gray-900">Đơn vị tính</label>
                                {formData.materialUnitDtoList.map((unit, index) => (
                                  <div key={index} className="flex space-x-2 mb-2">
                                    <input
                                      type="text"
                                      placeholder="Mã đơn vị"
                                      value={unit.unitId}
                                      onChange={(e) =>
                                        handleMaterialUnitChange(index, 'unitId', e.target.value)
                                      }
                                      className="w-1/3 border rounded px-3 py-2"
                                    />
                                    <input
                                      type="number"
                                      placeholder="Tỷ lệ chuyển đổi"
                                      value={unit.conversionRate}
                                      onChange={(e) =>
                                        handleMaterialUnitChange(index, 'conversionRate', e.target.value)
                                      }
                                      className="w-1/3 border rounded px-3 py-2"
                                    />
                                    <input
                                      type="number"
                                      placeholder="Giá"
                                      value={unit.price}
                                      onChange={(e) =>
                                        handleMaterialUnitChange(index, 'price', e.target.value)
                                      }
                                      className="w-1/3 border rounded px-3 py-2"
                                    />
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={addMaterialUnit}
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  + Thêm đơn vị tính
                                </button>
                              </div>
                            </div>

                            <div className="flex justify-end mt-6">
                              <button
                                type="submit"
                                className="bg-green-500 text-white font-semibold px-4 py-2 rounded hover:bg-green-600"
                              >
                                Lưu
                              </button>
                            </div>
                          </form>
                        </div>
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