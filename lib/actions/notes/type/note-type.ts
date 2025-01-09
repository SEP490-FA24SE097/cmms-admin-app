export type INote = {
  id: string;
  noteCode: string;
  storeId: string | null;
  storeName: string | null;
  totalQuantity: number;
  reasonDescription: string;
  type: string;
  timeStamp: string;
  details: NoteDetail[];
};

export type NoteDetail = {
  id: string;
  materialId: string;
  materialName: string;
  variantId: string | null;
  sku: string | null;
  quantity: number;
};
