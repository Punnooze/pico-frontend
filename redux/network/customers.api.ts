import axios from "axios";

export interface Customer {
  _id: string;
  name: string;
  email: string;
  favouriteBoards: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const getCustomerDetailsApi = async (
  customerId: string
): Promise<Customer> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customers/${customerId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting Customer details :", error);
    throw error;
  }
};
