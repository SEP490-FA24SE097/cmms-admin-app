export type ICustomer = {
    currentDebtTotal: number;
    totalSale: number;
    totalSaleAfterRefund: number;
    result: ICusInfo[];
  };
  
  export type ICusInfo = {
    storeCreateName: string;
    createByName: string; // ISO Date string
    customerType: string;
    customerStatus: string;
    currentDebt: number;
    totalSale: number;
    totalSaleAfterRefund: number;
    id: string;
    // fullName: string;
    // email: string;
    // userName: string;
    // password: string;
    // userVM: IUserVM;
    // sellPlace: number;
    // buyIn: string;
    // invoiceDetails: IInvoiceDetails[];
    // shippingDetailVM: IShippingDetailVM;
  };
