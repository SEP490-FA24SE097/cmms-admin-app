"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import "react-quill/dist/quill.snow.css";

import { useToast } from "@/hooks/use-toast";

import { useQueryClient } from "@tanstack/react-query";
import { IVariants } from "@/lib/actions/materials/type/material-type";

import { UpdateVariant } from "@/lib/actions/materials/action/material-action";
import React from "react";

export default function UpdateVariantP({
  item,
  setOpenV,
}: {
  item: IVariants;
  setOpenV: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [image64, setImage64] = React.useState("");
  const [loading, setLoading] = useState(false);

  const [material, setMaterial] = useState({
    id: item.variantId,
    name: item.sku,
    salePrice: item.price,
    costPrice: item.costPrice,
    imageFiles: item.image,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMaterial((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  if (!item) return <div>Đang tải....</div>;

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
        setImage64(base64WithoutPrefix);
        setMaterial((prev) => ({
          ...prev,
          imageFiles: base64,
        }));
      } catch (error) {
        console.error("Error converting image to base64:", error);
      }
    }
  };

  const handleUpdateVariant = async () => {
    const data = {
      id: material.id,
      sku: material.name,

      price: material.salePrice,
      costPrice: material.costPrice,
      variantImage: image64,
    };
    setLoading(true);

    try {
      const result = await UpdateVariant(data);
      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đơn vị mới đã được tạo thành công.",
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });
        setOpenV(false);
        queryClient.invalidateQueries({
          queryKey: ["MATERIAL_LIST"],
        });
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

  return (
    <div>
      <div className="grid grid-cols-5 grid-rows-1 gap-4">
        <div className="col-span-2 items-center">
          <img
            src={material.imageFiles}
            alt="Material"
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() => document.getElementById("image-upload")?.click()}
          />
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUploadMain}
          />
        </div>

        <div className="col-span-3 col-start-3 space-y-3">
          <div className="grid grid-cols-3 grid-rows-1 gap-4">
            <div className="font-bold">Tên Vật liệu:</div>
            <div className="col-span-2 col-start-2">
              <input
                className="border-b w-full hover:border-b-green-500 focus:outline-none focus:border-b-green-500 "
                type="text"
                name="name"
                value={material.name}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 grid-rows-1 gap-4">
            <div className="font-bold">Giá gốc:</div>
            <div className="col-span-2 col-start-2">
              <input
                className="border-b w-full hover:border-b-green-500 focus:outline-none focus:border-b-green-500 "
                type="number"
                name="costPrice"
                value={material.costPrice}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 grid-rows-1 gap-4">
            <div className="font-bold">Giá bán:</div>
            <div className="col-span-2 col-start-2">
              <input
                className="border-b w-full hover:border-b-green-500 focus:outline-none focus:border-b-green-500 "
                type="number"
                name="salePrice"
                value={material.salePrice}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex justify-end pt-10">
            {loading ? (
              <Button disabled>
                <Loader2 className="animate-spin" />
                Đang xử lý...
              </Button>
            ) : (
              <Button
                onClick={handleUpdateVariant}
                className="bg-blue-500 hover:bg-blue-600 font-bold text-white"
              >
                Cập nhật
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
