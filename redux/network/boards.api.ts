import { Api } from "@/utils/api";
import networkInstance from "@/utils/networkInstance";

export interface Board {
  _id: string;
  name: string;
  owner: string;
  members: string[];
}

export const getAllBoardsApi = async (): Promise<Board[] | []> => {
  try {
    const response = await networkInstance.get(Api.boards);
    return response.data;
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
};

export const getBoardById = async (boardId: string): Promise<Board | null> => {
  try {
    const response = await networkInstance.get(`${Api.boards}/${boardId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching board:", error);
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
