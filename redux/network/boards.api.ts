import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface Board {
  _id: string;
  name: string;
  owner: string;
  members: string[];
}

export const getBoardsApi = async (userId: string): Promise<Board[] | []> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/boards`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
};

export const createBoardApi = async (
  boardData: Partial<Board>
): Promise<Board> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/createBoard`, boardData);
    return response.data;
  } catch (error) {
    console.error("Error creating board:", error);
    throw error;
  }
};
