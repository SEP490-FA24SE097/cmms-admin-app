import React, { createContext, useContext, useState, ReactNode } from "react";

interface IMaterial {
  id: string;
  materialId: string;
  materialCode: string | null;
  materialName: string;
  materialImage: string;
  variantId: string | null;
  variantName: string | null;
  variantImage: string | null;
  quantity: number;
  materialPrice: number;
  variantPrice: number;
  lastUpdateTime: string;
  discount: number;
  note: string;
}

interface MaterialContextState {
  materials: IMaterial[];
  addList: (newMaterial: IMaterial) => void;
  remove: (materialId: string, variantId: string | null) => void;
  updateQuantity: (
    materialId: string,
    variantId: string | null,
    increment: boolean
  ) => void;
  changeQuantity: (
    materialId: string,
    variantId: string | null,
    changeBy: number
  ) => void;
  updateDiscount: (
    materialId: string,
    variantId: string | null,
    discount: number
  ) => void;
  updateNote: (
    materialId: string,
    variantId: string | null,
    note: string
  ) => void;
}

const defaultState: MaterialContextState = {
  materials: [],
  addList: () => {},
  remove: () => {},
  updateQuantity: () => {},
  changeQuantity: () => {},
  updateDiscount: () => {},
  updateNote: () => {},
};

const MaterialContext = createContext<MaterialContextState>(defaultState);

export const MaterialProvider = ({ children }: { children: ReactNode }) => {
  const [materials, setMaterials] = useState<IMaterial[]>([]);

  const addList = (newMaterial: IMaterial) => {
    setMaterials((prevMaterials) => {
      const existingMaterial = prevMaterials.find(
        (material) =>
          material.materialId === newMaterial.materialId &&
          material.variantId === newMaterial.variantId
      );
      if (existingMaterial) {
        return prevMaterials.map((material) =>
          material.materialId === newMaterial.materialId &&
          material.variantId === newMaterial.variantId
            ? { ...material, quantity: material.quantity + 1 }
            : material
        );
      } else {
        return [{ ...newMaterial, quantity: 1 }, ...prevMaterials];
      }
    });
  };

  // Remove a material by materialId and variantId
  const remove = (materialId: string, variantId: string | null) => {
    setMaterials((prevMaterials) =>
      prevMaterials.filter(
        (material) =>
          material.materialId !== materialId || material.variantId !== variantId
      )
    );
  };

  // Update quantity of a specific material by materialId and variantId
  const updateQuantity = (
    materialId: string,
    variantId: string | null,
    increment: boolean
  ) => {
    setMaterials((prevMaterials) =>
      prevMaterials.map((material) =>
        material.materialId === materialId && material.variantId === variantId
          ? {
              ...material,
              quantity: increment
                ? material.quantity + 1
                : Math.max(material.quantity - 1, 1), // Ensure quantity does not go below 1
            }
          : material
      )
    );
  };

  // Change quantity of a material by a specific value (increase or decrease)
  const changeQuantity = (
    materialId: string,
    variantId: string | null,
    changeBy: number
  ) => {
    setMaterials((prevMaterials) =>
      prevMaterials.map((material) =>
        material.materialId === materialId && material.variantId === variantId
          ? { ...material, quantity: Math.max(1, changeBy) } // Ensure quantity does not go below 1
          : material
      )
    );
  };

  // Update discount for a material by materialId and variantId
  const updateDiscount = (
    materialId: string,
    variantId: string | null,
    discount: number
  ) => {
    setMaterials((prevMaterials) =>
      prevMaterials.map((material) =>
        material.materialId === materialId && material.variantId === variantId
          ? { ...material, discount: Math.max(0, discount) } // Ensure discount is not negative
          : material
      )
    );
  };

  // Update note for a material by materialId and variantId
  const updateNote = (
    materialId: string,
    variantId: string | null,
    note: string
  ) => {
    setMaterials((prevMaterials) =>
      prevMaterials.map((material) =>
        material.materialId === materialId && material.variantId === variantId
          ? { ...material, note } // Update the note field
          : material
      )
    );
  };

  return (
    <MaterialContext.Provider
      value={{
        materials,
        updateNote,
        updateDiscount,
        addList,
        remove,
        updateQuantity,
        changeQuantity,
      }}
    >
      {children}
    </MaterialContext.Provider>
  );
};

// Custom Hook to use the Material Context
export const useMaterialContext = () => {
  const context = useContext(MaterialContext);
  if (!context) {
    throw new Error(
      "useMaterialContext must be used within a MaterialProvider"
    );
  }
  return context;
};
