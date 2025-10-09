import { Api } from "@/utils/api";
import networkInstance from "@/utils/networkInstance";

export interface Board {
  _id: string;
  name: string;
  owner: string;
  members: string[];
}

export const getBoardsApi = async (userId: string): Promise<Board[] | []> => {
  try {
    const response = await networkInstance.get(Api.boards, {
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
    const response = await networkInstance.post(Api.boards, boardData);
    return response.data;
  } catch (error) {
    console.error("Error creating board:", error);
    throw error;
  }
};
