"use client";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useGetBrand } from "@/lib/actions/materials-fields/react-query/brand-query";
import { useGetCategory } from "@/lib/actions/materials-fields/react-query/category-query";
import { useGetUnit } from "@/lib/actions/materials-fields/react-query/unit-query";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { CreateUnit } from "@/lib/actions/materials-fields/action/unit-action";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { CreateMaterial } from "@/lib/actions/materials/action/material-action";
interface Unit {
  unitId: string;
  conversionRate: number;
  price: number;
  costPrice: number;
}
interface MaterialData {
  barcode: string;
  name: string;
  costPrice: number;
  salePrice: number;
  weightValue: number;
  minStock: number;
  maxStock: number;
  basicUnitId: string;
  categoryId: string;
  brandId: string;
}
interface AddMaterialsProps {
  setOpenM: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function AddMaterials({ setOpenM }: AddMaterialsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    barcode: "",
    nameMaterial: "",
    costPrice: 0,
    salePrice: 0,
    minStock: 0,
    maxStock: 0,
    weightValue: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = Number(value);

    // Kiểm tra nếu trường là số và không cho phép giá trị âm
    if (
      [
        "costPrice",
        "salePrice",
        "minStock",
        "maxStock",
        "weightValue",
      ].includes(name)
    ) {
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue < 0 ? 0 : numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const [selectedBrand, setSelectBrand] = useState({ id: "", name: "" });
  const [selectedUnit, setSelectUnit] = useState({ id: "", name: "" });
  const { data: brands, isLoading: isLoadingBrand } = useGetBrand();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const { data: units, isLoading: isLoadingUnits } = useGetUnit();
  const filteredUnits = units?.data?.filter(
    (unit) => unit.id !== selectedUnit?.id
  );
  useEffect(() => {
    if (units && units.data && units.data.length > 0) {
      const firstUnit = units.data[0]; // Lấy phần tử đầu tiên
      setSelectUnit({ id: firstUnit.id, name: firstUnit.name });
    }
  }, [units]);
  const handleUnitChange = (value: any) => {
    const selectedUnitObject = units?.data.find((item) => item.id === value);
    setSelectUnit(selectedUnitObject || { id: "", name: "" }); // Handle potential missing store
  };
  const { data: caterogies, isLoading: isLoadingCategories } = useGetCategory();
  const selectedCategoryData = caterogies?.data.find(
    (category) => category.id === selectedCategory
  );
  const handleBrandChange = (value: any) => {
    const selectedBrandObject = brands?.data.find((item) => item.id === value);
    setSelectBrand(selectedBrandObject || { id: "", name: "" }); // Handle potential missing store
  };

  const [images, setImages] = useState<(string | null)[]>(Array(5).fill(null)); // 5 ô ảnh
  const [imagesFile, setImagesFile] = useState<(string | null)[]>(
    Array(5).fill(null)
  ); // Mảng chứa ảnh dạng base64
  const handleImageUpload = (file: File, index: number) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        let base64 = reader.result as string;

        // Xóa tiền tố "data:<mime-type>;base64,"
        const base64WithoutPrefix = base64.replace(/^data:.+;base64,/, "");

        // Cập nhật hình ảnh vào ô tương ứng
        const updatedImages = [...images];
        updatedImages[index] = URL.createObjectURL(file); // Hiển thị ảnh
        setImages(updatedImages);

        // Cập nhật base64 vào mảng imagesFile
        const updatedImagesFile = [...imagesFile];
        updatedImagesFile[index] = base64WithoutPrefix;
        setImagesFile(updatedImagesFile);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredArray = imagesFile.filter((item) => item !== null);

  const [unit, setUnit] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingM, setLoadingM] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCreateUnit = async () => {
    if (!unit.trim()) {
      toast({
        title: "Lỗi",
        description: "Tên đơn vị không được để trống.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await CreateUnit([unit]);
      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đơn vị mới đã được tạo thành công.",
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });
        setUnit(""); // Reset form sau khi thành công
        queryClient.invalidateQueries({
          queryKey: ["UNITS_LIST"],
        });
        setOpen(false);
      } else {
        toast({
          title: "Lỗi",
          description: result.error || "Có lỗi xảy ra khi tạo đơn vị mới.",
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
      setLoading(false);
    }
  };

  const [unitList, setUnitList] = useState<Unit[]>([]);

  const handleAddUnit = () => {
    setUnitList((prev) => [
      ...prev,
      { unitId: "", conversionRate: 0, price: 0, costPrice: 0 },
    ]);
  };

  const handleChange = (index: number, field: keyof Unit, value: any) => {
    setUnitList((prev) =>
      prev.map((unit, i) => (i === index ? { ...unit, [field]: value } : unit))
    );
  };
  const handleDelete = (index: number) => {
    setUnitList((prev) => prev.filter((_, i) => i !== index));
  };

  const [description, setDescription] = useState<string>(""); // State lưu nội dung mô tả

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };
  const [mainImg, setMainImg] = useState({ base64: "", img: "" });
  const convertToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUploadMain = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        const base64WithoutPrefix = base64.replace(/^data:.+;base64,/, "");
        setMainImg({ base64: base64WithoutPrefix, img: base64 });
      } catch (error) {
        console.error("Error converting image to base64:", error);
      }
    }
  };
  const handleCreateMaterial = async () => {
    // Tạo một đối tượng tạm thời để lưu trữ các giá trị
    const tempData: MaterialData = {
      barcode: formData.barcode,
      name: formData.nameMaterial,
      costPrice: formData.costPrice,
      salePrice: formData.salePrice,
      weightValue: formData.weightValue,
      minStock: formData.minStock,
      maxStock: formData.maxStock,
      basicUnitId: selectedUnit.id,
      categoryId: selectedSubCategory,
      brandId: selectedBrand.id,
    };

    const requiredFields: Array<{ key: keyof MaterialData; label: string }> = [
      { key: "barcode", label: "Mã hàng" },
      { key: "name", label: "Tên sản phẩm" },
      { key: "costPrice", label: "Giá gốc" },
      { key: "salePrice", label: "Giá bán" },
      { key: "weightValue", label: "trọng lượng" },
      { key: "minStock", label: "Min Stock" },
      { key: "maxStock", label: "Max Stock" },
      { key: "basicUnitId", label: "Đơn vị cơ bản" },
      { key: "categoryId", label: "Danh mục" },
      { key: "brandId", label: "Nhãn hàng" },
    ];

    for (const field of requiredFields) {
      if (!tempData[field.key]) {
        toast({
          title: `${field.label} không được để trống!`,
          description: "Vui lòng điền đầy đủ thông tin",
          variant: "destructive",
        });

        return; // Dừng lại nếu có trường không hợp lệ
      }
    }
    if (!mainImg.base64) {
      toast({
        title: "Không có ảnh chính",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });

      return;
    }
    // Nếu tất cả các trường đều hợp lệ, định nghĩa data
    const data = {
      ...tempData,
      mainImage: mainImg.base64,
      subImages: filteredArray,
      description: description,
      materialUnitDtoList: unitList,
    };
    setLoadingM(true);
    try {
      const result = await CreateMaterial(data);
      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đơn vị mới đã được tạo thành công.",
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });
        setOpenM(false);
        queryClient.invalidateQueries({
          queryKey: ["MATERIAL_WAREHOUSE_LIST"],
        });
      } else {
        toast({
          title: "Lỗi",
          description: result.error || "Có lỗi xảy ra khi tạo đơn vị mới.",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      let errorMessage = "Có lỗi xảy ra khi kết nối đến server.";

      if (error instanceof Error) {
        errorMessage = error.message; // Use the error's message if available
      }

      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoadingM(false);
    }
  };
  return (
    <div>
      <div className="grid grid-cols-5 grid-rows-1 gap-7 pt-5">
        <div className="col-span-3 pr-5 space-y-5">
          <div className="mb-4 flex gap-5 items-center">
            <label className="block w-[150px] text-black">Mã vạch</label>
            <input
              name="barcode"
              value={formData.barcode}
              onChange={handleInputChange}
              className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              type="text"
            />
          </div>
          <div className="mb-4 flex gap-5 items-center">
            <label className="block w-[150px] text-black">Tên sản phẩm</label>
            <input
              name="nameMaterial"
              value={formData.nameMaterial}
              onChange={handleInputChange}
              className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              type="text"
            />
          </div>
          <div className="mb-4 flex gap-5 items-center">
            <label className="block w-[150px] text-black">Thương hiệu</label>
            <Select onValueChange={handleBrandChange} value={selectedBrand.id}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn Thương Hiệu" />
              </SelectTrigger>
              <SelectContent>
                {brands?.data.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4 flex gap-5 items-center">
            <label className="block w-[150px] text-black">Danh mục</label>
            <div className="flex w-full justify-between">
              <div>
                {/* Chọn Danh mục chính */}
                <Select
                  onValueChange={(value) => {
                    setSelectedCategory(value);
                    setSelectedSubCategory(""); // Reset danh mục phụ
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Chọn Danh mục chính" />
                  </SelectTrigger>
                  <SelectContent>
                    {caterogies?.data.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedCategory && (
                <div>
                  {/* Chọn SubCategory */}
                  <Select
                    onValueChange={(value) => setSelectedSubCategory(value)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue
                        placeholder={
                          selectedSubCategory
                            ? selectedCategoryData?.subCategories.find(
                                (sub) => sub.id === selectedSubCategory
                              )?.name
                            : "Chọn Danh mục phụ"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategoryData?.subCategories.map(
                        (subCategory) => (
                          <SelectItem
                            key={subCategory.id}
                            value={subCategory.id}
                          >
                            {subCategory.name}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-5">
            <h1>Ảnh chính</h1>
            <label className="block border border-dashed cursor-pointer">
              {mainImg.img ? (
                <img
                  src={mainImg.img}
                  alt={`MainImg`}
                  className="w-32 h-32 object-cover"
                />
              ) : (
                <img
                  src="/upload-file.png"
                  className="w-32 h-32 object-cover"
                />
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUploadMain}
              />
            </label>
          </div>
          <div>
            <h1>Ảnh phụ</h1>
            <div className="mb-4 flex gap-5 items-center">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative border border-dashed border-gray-300"
                >
                  <label className="block cursor-pointer">
                    {image ? (
                      <img
                        src={image}
                        alt={`Uploaded ${index + 1}`}
                        className="w-24 h-24 object-cover"
                      />
                    ) : (
                      <img
                        src="/upload-file.png"
                        className="w-24 h-24 object-cover"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e.target.files![0], index)
                      }
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-2 col-start-4">
          <div className="mb-4 flex gap-5 items-center">
            <label className="block w-[150px] text-black">Giá vốn</label>
            <input
              name="costPrice"
              value={formData.costPrice}
              onChange={handleInputChange}
              className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              type="number"
              min="0"
            />
          </div>
          <div className="mb-4 flex gap-5 items-center">
            <label className="block w-[150px] text-black">Giá bán</label>
            <input
              name="salePrice"
              value={formData.salePrice}
              onChange={handleInputChange}
              className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              type="number"
              min="0"
            />
          </div>
          <div className="mb-4 flex gap-5 items-center">
            <label className="block w-[150px] text-black">Min Stock</label>
            <input
              name="minStock"
              value={formData.minStock}
              onChange={handleInputChange}
              className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              type="number"
              min="0"
            />
          </div>
          <div className="mb-4 flex gap-5 items-center">
            <label className="block w-[150px] text-black">Max Stock</label>
            <input
              name="maxStock"
              value={formData.maxStock}
              onChange={handleInputChange}
              className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              type="number"
              min="0"
            />
          </div>
          <div className="mb-4 flex gap-5 items-center">
            <label className="block w-[150px] text-black">Trọng lượng</label>
            <div className="grid grid-cols-5 grid-rows-1 gap-4">
              <div className="col-span-4">
                <input
                  name="weightValue"
                  value={formData.weightValue}
                  onChange={handleInputChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                  type="number"
                  min="0"
                />
              </div>
              <div className="col-start-5 border-b-2 border-gray-300 text-center">
                KG
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-2 mb-10">
        <h2 className="py-2">Mô tả</h2>
        <ReactQuill
          value={description}
          onChange={handleDescriptionChange}
          theme="snow"
          placeholder="Nhập mô tả tại đây..."
          className="h-[100px]"
        />
      </div>
      <div className="">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="bg-blue-300 mt-5 px-7 py-2 font-bold text-sm rounded-sm border">
              Thêm đơn vị
            </AccordionTrigger>
            <AccordionContent className="border-x">
              <div className="pt-5">
                <div className="flex gap-5 items-center px-5">
                  <h1 className="w-[150px] font-bold">Đơn vị cơ bản:</h1>
                  <Select
                    onValueChange={handleUnitChange}
                    value={selectedUnit.id}
                  >
                    <SelectTrigger className="w-auto">
                      <SelectValue placeholder="Chọn Đơn Vị Cơ Bản" />
                    </SelectTrigger>

                    <SelectContent>
                      {units?.data.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <FaPlus /> Thêm đơn vị mới
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Thêm Đơn vị mới</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Input
                            id="unit"
                            className="col-span-3"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            placeholder="Nhập tên đơn vị"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          type="submit"
                          onClick={handleCreateUnit}
                          disabled={loading}
                        >
                          {loading ? "Đang tạo..." : "Tạo"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="mt-5 px-5">
                  {unitList.map((unit, index) => (
                    <div key={index} className="mb-5 flex gap-10 items-center">
                      <div>
                        <label className="block w-[150px] text-black font-semibold">
                          Tên đơn vị
                        </label>
                        <Select
                          onValueChange={(value) =>
                            handleChange(index, "unitId", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn đơn vị" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredUnits?.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block w-[150px] text-black font-semibold">
                          Giá quy đổi
                        </label>
                        <input
                          className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                          type="number"
                          value={unit.conversionRate}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "conversionRate",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <label className="block w-[150px] text-black font-semibold">
                          Giá vốn
                        </label>
                        <input
                          className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                          type="number"
                          value={unit.costPrice}
                          onChange={(e) =>
                            handleChange(index, "costPrice", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="block w-[150px] text-black font-semibold">
                          Giá bán
                        </label>
                        <input
                          className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                          type="number"
                          value={unit.price}
                          onChange={(e) =>
                            handleChange(index, "price", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <button
                          className="hover:text-red-500"
                          onClick={() => handleDelete(index)}
                        >
                          <RiDeleteBin5Line size={20} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <Button onClick={handleAddUnit} variant="outline">
                    <FaPlus /> Thêm đơn vị
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="flex justify-end mt-2">
        {loadingM ? (
          <Button disabled>
            <Loader2 className="animate-spin" />
            Đang xử lý...
          </Button>
        ) : (
          <Button
            onClick={handleCreateMaterial}
            className="bg-blue-500 font-bold hover:bg-blue-600 text-white"
          >
            Thêm mới
          </Button>
        )}
      </div>
    </div>
  );
}
