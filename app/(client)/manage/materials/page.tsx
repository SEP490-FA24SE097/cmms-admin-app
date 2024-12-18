"use client";
import ManagerHeader from "@/components/manager/header/page";
import { Button } from "@/components/ui/button";
import NavHeader from "@/components/manager/nav-header/page";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useState, ChangeEvent, FormEvent } from "react";
import MaterialDetails from "@/components/manager/material-tab/material-detail";
import MaterialTrackingHistory from "@/components/manager/material-tab/material-tracking-history";
import { useGetMaterial, useGetMaterialWarehouse } from "@/lib/actions/materials/react-query/material-query";
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
import { createMaterial, createUnit } from "@/lib/actions/materials/action/material-action";
import { ISubCategory } from "@/lib/actions/materials-fields/type/category";


export default function ManageMaterialPage() {
  const searchParams = {
    page: 1,
    itemPerPage: 10,
  };



  const formatDateTime = (timeStamp: any) => {
    if (!timeStamp) return ""; // Kiểm tra giá trị null hoặc undefined
    const date = new Date(timeStamp);

    // Định dạng ngày tháng năm và giờ phút
    const formattedDate = date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formattedDate} ${formattedTime}`;
  };

  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    name: '',
    costPrice: 0,
    salePrice: 0,
    imagesFile: [] as string[],
    weightValue: 0,
    description: '',
    minStock: 0,
    maxStock: 0,
    basicUnitId: '',
    categoryId: '',
    brandId: '',
    materialUnitDtoList: [] as { unitId: string; conversionRate: number; price: number }[],
  });

  const [formUnitData, setFormUnitData] = useState({
    name: ''
  });

  // change create new unit form
  const handleUnitFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormUnitData((prev) => ({
      ...prev,
      [name]: value, // Cập nhật giá trị cho trường tương ứng
    }));
  };

  // handle submit create new unit
  const handleSubmitUnitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await createUnit(formUnitData);
    } catch (error) {
      console.log(error);
    }
  };




  const handleAddUnit = () => {
    setFormData((prev) => ({
      ...prev,
      materialUnitDtoList: [
        ...prev.materialUnitDtoList,
        { unitId: '', conversionRate: 0, price: 0 }, // Thêm một đơn vị mới
      ],
    }));
  };

  const handleUnitChange = (index: number, field: string, value: string | number) => {
    const updatedUnits = [...formData.materialUnitDtoList];
    updatedUnits[index] = { ...updatedUnits[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      materialUnitDtoList: updatedUnits,
    }));
  };

  const handleRemoveUnit = (index: number) => {
    const updatedUnits = formData.materialUnitDtoList.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      materialUnitDtoList: updatedUnits,
    }));
  };

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


  const handleEditorChange = (html: string) => {
    setEditorHtml(html);
    setFormData((prev) => ({
      ...prev,
      description: html, // Cập nhật formData với giá trị từ editor
    }));
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = reader.result as string;
            // Cắt bỏ tiền tố base64
            resolve(base64String || '');
          };
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
      };

      try {
        const base64Images = await Promise.all(files.map((file) => convertToBase64(file)));
        setFormData((prev) => ({ ...prev, imagesFile: base64Images }));
      } catch (error) {
        console.error("Error converting file to Base64:", error);
      }
    }
  };


  const addMaterialUnit = () => {
    setFormData((prev) => ({
      ...prev,
      materialUnitDtoList: [
        // ...prev.materialUnitDtoList,
        { unitId: '', conversionRate: 0, price: 0 },
      ],
    }));
  };

  // submit material form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {

      const cleanedImagesFile = formData.imagesFile.map(imageBase64 => {
        return imageBase64.split(',')[1]; // Cắt bỏ tiền tố
      });
      const cleanedFormData = {
        ...formData,
        imagesFile: cleanedImagesFile, // Sử dụng list hình ảnh đã được làm sạch
      };
      const response = await createMaterial(cleanedFormData);
      console.log(response);
      console.log('Submitted Data:', cleanedFormData);

    } catch (error) {
      console.log(error);
    }
  };

  const { data: materials, isLoading: isLoadingMaterails } = useGetMaterialWarehouse(searchParams);
  const { data: categories, isLoading: isLoadingCategories } = useGetCategory();
  const { data: units, isLoading: isLoadingUnits } = useGetUnit();
  const { data: brands, isLoading: isLoadingBrands } = useGetBrand();
  const [editorHtml, setEditorHtml] = useState<string>('');


  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedCategory(selectedId);

    const category = categories?.data.find((cat) => cat.id === selectedId);
    setSubCategories(category ? category.subCategories : []);

    // Cập nhật formData.categoryId
    setFormData((prev) => ({
      ...prev,
      categoryId: '', // Reset categoryId khi chọn danh mục chính
    }));
  };

  const [isActive, setIsActive] = useState("chitiet");

  function e(event: ChangeEvent<HTMLInputElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="h-[100vh] grid grid-cols-1 grid-rows-10 gap-4">
      <div>
        <ManagerHeader />
        <NavHeader />
      </div>
      <div className="row-span-9 mt-3 w-[80%] mx-auto">
        <div className="">
          <div className="grid grid-cols-12 gap-4 mt-3">
            <div className="col-span-3 text-xl font-semibold">Hàng hóa</div>
            <div className="col-span-9 grid grid-cols-2 justify-between">
              <div className="w-full">
                <form className="max-w-md">
                  <label
                    htmlFor="default-search"
                    className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                  >
                    Tìm kiếm
                  </label>
                  <div className="relative">
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
                      name="n"
                      id="default-search"
                      className="block w-full py-1 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Nhập tên hàng hóa"
                      required
                    />
                  </div>
                </form>
              </div>


              {/* Add new Material */}
              <div className="flex justify-end align-middle ">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-green-600 text-white hover:bg-green-700 hover:text-white px-4 mx-2 transition-colors"
                      variant="outline"
                    >
                      Thêm mới
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[960px] max-h-[100vh] overflow-hidden overflow-y-auto">
                    <DialogHeader>
                      <DialogDescription>
                        <div className="bg-white max-w-4xl rounded-lg shadow-lg p-6 ">
                          {/* Header */}
                          <div className="flex justify-between items-center border-b pb-4 mb-4">
                            <h2 className="text-xl font-semibold text-black">Thêm hàng</h2>
                          </div>

                          {/* Form */}
                          <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="col-span-2">
                                <label className="font-bold block text-gray-900">Tên hàng</label>
                                <input
                                  name="name"
                                  type="text"
                                  value={formData.name}
                                  onChange={handleChange}
                                  className="w-full border rounded px-3 py-2 text-gray-900"
                                />
                              </div>

                              <div>
                                <label className="font-bold block text-gray-900">Giá vốn</label>
                                <input
                                  name="costPrice"
                                  type="number"
                                  value={formData.costPrice}
                                  onChange={handleChange}
                                  className="w-full border rounded px-3 py-2 text-gray-900"
                                />
                              </div>

                              <div>
                                <label className="font-bold block text-gray-900">Giá bán</label>
                                <input
                                  name="salePrice"
                                  type="number"
                                  value={formData.salePrice}
                                  onChange={handleChange}
                                  className="w-full border rounded px-3 py-2 text-gray-900"
                                />
                              </div>

                              <div>
                                <label className="font-bold block text-gray-900">Tồn kho tối thiểu</label>
                                <input
                                  name="minStock"
                                  type="number"
                                  value={formData.minStock}
                                  onChange={handleChange}
                                  className="w-full border rounded px-3 py-2 text-gray-900"
                                />
                              </div>

                              <div>
                                <label className="font-bold block text-gray-900">Tồn kho tối đa</label>
                                <input
                                  name="maxStock"
                                  type="number"
                                  value={formData.maxStock}
                                  onChange={handleChange}
                                  className="w-full border rounded px-3 py-2 text-gray-900"
                                />
                              </div>


                              <div className="col-span-2">
                                <label className="font-bold block text-gray-900">Mô tả sản phẩm</label>
                                <ReactQuill value={editorHtml} onChange={handleEditorChange} className="max-h-[300px] overflow-hidden overflow-y-auto" />
                              </div>

                              <div className="col-span-2">
                                <label className="font-bold block text-gray-900">Hình ảnh</label>
                                <input
                                  type="file"
                                  multiple
                                  onChange={handleImageChange}
                                  className="w-full border rounded px-3 py-2 text-gray-900"
                                />
                                <div className="flex space-x-2 mt-2">
                                  {formData.imagesFile.map((imageBase64, index) => (
                                    <img
                                      key={index}
                                      src={imageBase64}
                                      alt="Selected"
                                      className="w-20 h-20 object-cover border rounded"
                                    />
                                  ))}
                                </div>
                              </div>


                              <div>
                                <label htmlFor="nhomhang" className="font-bold block text-gray-900 mb-1">Chọn danh mục chính:</label>
                                <select id="nhomhang" onChange={handleCategoryChange} className="w-full border rounded px-3 py-2 text-gray-900">
                                  <option value="" className="text-gray-900">-- Chọn danh mục chính--</option>
                                  {categories?.data.map((cate) => (
                                    <option key={cate.id} value={cate.id}>
                                      {cate.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                {subCategories.length > 0 && (
                                  <div>
                                    <label htmlFor="categories" className="font-bold block text-gray-900 mb-1">
                                      Chọn nhóm hàng
                                    </label>
                                    <select
                                      id="categories"
                                      className="w-full border rounded px-3 py-2 text-gray-900"
                                      value={formData.categoryId} // Gán giá trị từ formData
                                      onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))} // Cập nhật formData.categoryId
                                    >
                                      <option value="" className="text-gray-900">-- Chọn danh mục con --</option>
                                      {subCategories.map((subCategory) => (
                                        <option key={subCategory.id} value={subCategory.id}>
                                          {subCategory.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                )}
                              </div>


                              {/* Brand Dropdown */}
                              <div>
                                <label htmlFor="brandId" className="font-bold block text-gray-900 mb-1">
                                  Chọn thương hiệu
                                </label>
                                <select
                                  name="brandId"
                                  id="brandId"
                                  value={formData.brandId}
                                  onChange={handleChange}
                                  className="w-full border rounded px-3 py-2 text-gray-900"
                                >
                                  <option value="" className="text-gray-900">-- Chọn thương hiệu --</option>
                                  {brands?.data.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                      {brand.name}
                                    </option>
                                  ))}
                                </select>
                              </div>


                              {/* Unit Dropdown */}
                              <div className="col-span-2">
                                <div className="grid grid-cols-4 gap-4">
                                  <div className="col-span-1">
                                    <label className="font-bold block text-gray-900">Khối lượng</label>
                                    <input
                                      name="weightValue"
                                      type="number"
                                      value={formData.weightValue}
                                      onChange={handleChange}
                                      className="w-full border rounded px-3 py-2 text-gray-900"
                                    />
                                  </div>
                                  <div className="col-span-1">
                                    <label htmlFor="" className="font-bold block text-gray-900 mb-1">
                                      Chọn đơn vị tính
                                    </label>
                                    <select
                                      name="basicUnitId"
                                      id="basicUnitId"
                                      value={formData.basicUnitId}
                                      onChange={handleChange}
                                      className="w-full border rounded px-3 py-2 text-gray-900"
                                    >
                                      <option className="text-gray-900">-- Chọn đơn vị tính --</option>
                                      <option key={units?.data[1].id} value={units?.data[1].id}>
                                        {units?.data[1].name}
                                      </option>

                                    </select>
                                  </div>
                                </div>

                              </div>

                            </div>
                            <div className="col-span-2">
                              <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                  <AccordionTrigger showIcon={true} className="w-full">
                                    <div className="bg-blue-300 w-full">
                                      + Đơn vị tính
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="grid grid-cols-4 max-w-[300px]">
                                      <div className="col-span-3">
                                        <label htmlFor="basicUnitId" className="font-bold block text-black mb-1">
                                          Chọn đơn vị tính
                                        </label>
                                        <div className="flex">
                                          <select
                                            name="basicUnitId"
                                            id="basicUnitId"
                                            value={formData.basicUnitId}
                                            onChange={handleChange}
                                            className="w-full block border rounded px-3 py-1 text-gray-900 ">
                                            <option className="text-gray-900">-- Chọn đơn vị --</option>
                                            {units?.data.map((unit) => (
                                              <option key={unit.id} value={unit.id}>
                                                {unit.name}
                                              </option>
                                            ))}
                                          </select>



                                          {/* Tạo đơn vị mới */}


                                          <Dialog>
                                            <DialogTrigger>
                                              <Button className="bg-green-500 hover:bg-green-700 ml-4 text-white px-4 py-2 rounded col-span-1">+</Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-[500px] max-h-[100vh] overflow-hidden overflow-y-auto">
                                              <DialogHeader>
                                                <DialogDescription>
                                                  <form onSubmit={handleSubmitUnitForm}> {/* Thêm onSubmit nếu cần */}
                                                    <div>
                                                      <label className="font-bold block text-gray-900">Đơn vị mới</label>
                                                      <input
                                                        name="unitName"
                                                        type="text"
                                                        onChange={handleUnitFormChange}
                                                        value={formUnitData.name}
                                                        className="w-full border rounded px-3 py-2 text-gray-900"
                                                      />
                                                    </div>
                                                    <button
                                                      type="submit" // Đổi thành type="submit" nếu bạn muốn gửi form
                                                      className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
                                                    >
                                                      Thêm đơn vị
                                                    </button>
                                                  </form>
                                                </DialogDescription>
                                              </DialogHeader>
                                            </DialogContent>
                                          </Dialog>



                                        </div>

                                      </div>

                                    </div>

                                    {formData.materialUnitDtoList.map((unit, index) => (
                                      <div key={unit.unitId} className="grid grid-cols-4 mb-2">
                                        <div className="col-span-1">
                                          <label className="font-bold block text-gray-900">Tên đơn vị</label>
                                          <select
                                            name="basicUnitId"
                                            id="basicUnitId"
                                            value={unit.unitId}
                                            onChange={(e) => handleUnitChange(index, 'unitId', e.target.value)}
                                            className="w-full block border rounded px-3 py-1 text-gray-900 col-span-3">
                                            <option className="text-gray-900">-- Chọn đơn vị --</option>
                                            {units?.data.map((unit) => (
                                              <option key={unit.id} value={unit.id}>
                                                {unit.name}
                                              </option>
                                            ))}
                                          </select>

                                        </div>
                                        <div className="col-span-1">
                                          <label className="font-bold block text-gray-900">Giá trị quy đổi</label>
                                          <input
                                            name="conversionRate"
                                            type="number"
                                            value={unit.conversionRate}
                                            onChange={(e) => handleUnitChange(index, 'conversionRate', Number(e.target.value))}
                                            className="w-full border rounded px-3 py-1 text-gray-900 max-w-[200px]"
                                          />
                                        </div>
                                        <div className="col-span-1">
                                          <label className="font-bold block text-gray-900">Giá bán</label>
                                          <input
                                            name="price"
                                            type="number"
                                            value={unit.price}
                                            onChange={(e) => handleUnitChange(index, 'price', Number(e.target.value))}
                                            className="w-full border rounded px-3 py-1 text-gray-900 max-w-[200px]"
                                          />
                                        </div>
                                        <div className="col-span-1 flex items-center">
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveUnit(index)}
                                            className="text-red-500 hover:text-red-700"
                                          >
                                            Xóa
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                    <button
                                      type="button"
                                      onClick={handleAddUnit}
                                      className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
                                    >
                                      Thêm đơn vị
                                    </button>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
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

            {/* side bar */}
            <div className="col-span-3 w-full bg-green-300">
              <div>Loại hàng</div>
              <div>Nhóm hàng</div>
              <div>Tồn kho</div>

            </div>



            {/* material contents */}
            <div className="col-span-9 text-sm">
              <div className="grid grid-cols-9 bg-blue-200 p-2">
                <div className="col-span-2">Mã hàng</div>
                <div className="col-span-2">Tên hàng</div>
                <div>Giá vốn</div>
                <div>Giá bán</div>
                <div>Tồn kho</div>
                <div className="col-span-2">Ngày tạo</div>
              </div>

              {materials?.data.map((item) => (
                <div key={item.id}>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger showIcon={false} className="grid grid-cols-9">
                        <div className="flex col-span-2">
                          <img src={`${item.variantImage || item.materialImage}`} className="mr-3 w-10"></img>
                          {item.materialCode}
                        </div>
                        <div className="col-span-2">{item.variantName || item.materialName}</div>
                        <div>{item.variantPrice?.toLocaleString('vi-VN') || item.materialPrice?.toLocaleString('vi-VN')}</div>
                        <div>{item.variantCostPrice?.toLocaleString('vi-VN') || item.materialCostPrice?.toLocaleString('vi-VN')}</div>
                        <div>{item.quantity}</div>
                        <div className="col-span-2">{formatDateTime(item.lastUpdateTime)}</div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="">
                          <Button className="px-3 py-1 hover:bg-green-300 text-black bg-blue-200 text-sm" onClick={() => setIsActive("chitiet")}>
                            Thông tin sản phẩm{" "}
                          </Button>
                          <Button className="px-3 py-1 hover:bg-green-300 text-black bg-blue-200 ml-3 text-sm" onClick={() => setIsActive("tracking")}>
                            Chi tiết sản phẩm{" "}
                          </Button>
                        </div>
                        <div>
                          {isActive === "chitiet" ? (
                            <MaterialDetails materialId={`${item.materialId}`} />
                          ) : (
                            <MaterialTrackingHistory />
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}
