import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const loginApi = async (
  email: string,
  password: string
): Promise<string> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting Customer details :", error);
    throw error;
  }
};
