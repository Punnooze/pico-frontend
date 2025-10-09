import { Api } from "@/utils/api";
import networkInstance from "@/utils/networkInstance";

export interface Customer {
  _id: string;
  name: string;
  email: string;
  favouriteBoards: string;
}

export const getCustomerDetailsApi = async (
  customerId: string
): Promise<Customer> => {
  try {
    const response = await networkInstance.get(Api.customerMe);
    return response.data;
  } catch (error) {
    console.error("Error getting Customer details :", error);
    throw error;
  }
};
