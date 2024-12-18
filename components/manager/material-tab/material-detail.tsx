"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetMaterialById } from "@/lib/actions/materials/react-query/material-query";
import { useState } from "react";
import ReactQuill from "react-quill";

interface MaterialDetails {
  materialId: string;
}
interface MaterialDetailsProps {
  materialId: string;
}

const MaterialDetails: React.FC<MaterialDetailsProps> = ({ materialId }) => {
  const [editorHtml, setEditorHtml] = useState<string>('');
  const { data: materials, isLoading: isLoadingMaterials } = useGetMaterialById(materialId);

  if (isLoadingMaterials) {
    return <div>Loading...</div>;
  }



  return (
    <div className="mt-3">
      <div className="mt-3">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-blue-700 mb-2">
            Thép cây Việt Nhật D16
          </h1>
          <div className="flex items-center mb-4">
            <span className="text-green-600 mr-4">
              <i className="fas fa-check-circle">
              </i>
              Bán trực tiếp
            </span>
            <span className="text-red-600">
              <i className="fas fa-times-circle">
              </i>
              Không tích điểm
            </span>
          </div>
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 lg:w-1/3 p-2">
              <img alt="Image of steel bars" className="w-full" height="200" src={`${materials?.data?.material.imageUrl}`} width="300" />
            </div>
            <div className="w-full md:w-1/2 lg:w-2/3 p-2">
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="font-bold">
                      Mã hàng:
                    </td>
                    <td>
                      {materials?.data?.material.barCode}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">
                      Nhóm hàng:
                    </td>
                    <td>
                      {materials?.data?.material.category}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-bold">
                      Thương hiệu:
                    </td>
                    <td>
                      {materials?.data?.material.brand}
                    </td>
                  </tr>

                  <tr>
                    <td className="font-bold">
                      Tồn kho tối thiểu
                    </td>
                    <td>
                      {materials?.data?.material.minStock}
                    </td>
                  </tr>

                </tbody>
                <div className="font-bold">Mô tả sản phẩm</div>
                <ReactQuill value={materials?.data?.material.description} className="max-h-[300px] overflow-hidden overflow-y-auto" />
              </table>
            </div>
          </div>
          <div className="flex flex-wrap mt-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded mr-2">
              <i className="fas fa-check">
              </i>
              Cập nhật
            </button>
            <button className="bg-gray-700 text-white px-4 py-2 rounded mr-2">
              <i className="fas fa-barcode">
              </i>
              In tem mã
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded mr-2">
              <i className="fas fa-copy">
              </i>
              Sao chép
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded mr-2">
              <i className="fas fa-lock">
              </i>
              Ngừng kinh doanh
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded">
              <i className="fas fa-trash">
              </i>
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MaterialDetails;
