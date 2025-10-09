import { Api } from "@/utils/api";
import networkInstance from "@/utils/networkInstance";

export const loginApi = async (
  email: string,
  password: string
): Promise<string> => {
  try {
    const response = await networkInstance.post(Api.login, {
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
