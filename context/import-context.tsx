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
  remove: (id: string) => void;
  updateQuantity: (id: string, increment: boolean) => void;
  changeQuantity: (id: string, changeBy: number) => void;
  updateDiscount: (id: string, discount: number) => void;
  updateNote: (id: string, note: string) => void;
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

  // Add a new material to the list
  const addList = (newMaterial: IMaterial) => {
    setMaterials((prevMatrials) => {
      const existingMaterial = prevMatrials.find(
        (material) =>
          material.id === newMaterial.id &&
          material.variantId === newMaterial.variantId
      );
      if (existingMaterial) {
        return prevMatrials.map((material) =>
          material.id === newMaterial.id &&
          material.variantId === newMaterial.variantId
            ? { ...material, quantity: material.quantity + 1 }
            : material
        );
      } else {
        return [{ ...newMaterial, quantity: 1 }, ...prevMatrials];
      }
    });
  };

  // Remove a material by id
  const remove = (id: string) => {
    setMaterials((prevMaterials) =>
      prevMaterials.filter((material) => material.id !== id)
    );
  };

  // Update quantity of a specific material by id
  const updateQuantity = (id: string, increment: boolean) => {
    setMaterials((prevMaterials) =>
      prevMaterials.map((material) =>
        material.id === id
          ? {
              ...material,
              quantity: increment
                ? material.quantity + 1
                : material.quantity - 1,
            }
          : material
      )
    );
  };

  // Change quantity of a material by a specific value (increase or decrease)
  const changeQuantity = (id: string, changeBy: number) => {
    setMaterials((prevMaterials) =>
      prevMaterials.map((material) =>
        material.id === id
          ? { ...material, quantity: Math.max(1, changeBy) } // Ensure quantity is not negative
          : material
      )
    );
  };
  const updateDiscount = (id: string, discount: number) => {
    setMaterials((prevMaterials) =>
      prevMaterials.map((material) =>
        material.id === id
          ? { ...material, discount: Math.max(0, discount) } // Ensure quantity is not negative
          : material
      )
    );
  };
  const updateNote = (id: string, note: string) => {
    setMaterials((prevMaterials) =>
      prevMaterials.map((material) =>
        material.id === id
          ? { ...material, note } // Cập nhật trường note của material
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
