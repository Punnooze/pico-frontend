import { Api } from "@/utils/api";
import networkInstance from "@/utils/networkInstance";

import type { Category } from "@/types/board.types";
import boardData from "@/utils/boardData.json";

// 🔧 MOCK MODE: Set to false when backend is ready
const USE_MOCK_DATA = true;

export interface Board {
  _id: string;
  name: string;
  owner: string;
  members: string[];
  taskCounter?: number;
  categories: Category[];
  createdAt?: string;
  updatedAt?: string;
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

export const getBoardById = async (boardId: string): Promise<any> => {
  try {
    if (USE_MOCK_DATA) {
      // Mock mode: Make API call but return mock data
      console.log("🔧 Mock mode: Using boardData.json for board", boardId);
      await networkInstance.get(`${Api.boards}/${boardId}`).catch(() => {
        console.log("🔧 Mock mode: API call failed, using mock data anyway");
      });

      console.log("✅ Mock mode: Returning data:", {
        board: boardData.board,
        tasksByCategory: boardData.tasksByCategory,
      });

      return boardData;
    }

    // Production mode: Use real API response
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

export interface MoveTaskPayload {
  taskId: string;
  boardId: string;
  oldCategoryId: string;
  newCategoryId: string;
  newCategoryName: string;
}

export const moveTaskApi = async (payload: MoveTaskPayload): Promise<void> => {
  if (USE_MOCK_DATA) {
    // Mock mode: Simulate API call with delay
    console.log("🔧 Mock mode: Simulating task move", payload);

    // Simulate network delay (200ms)
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Make the actual API call but ignore the response
    await networkInstance
      .patch(`${Api.boards}/${payload.boardId}/tasks/${payload.taskId}/move`, {
        oldCategoryId: payload.oldCategoryId,
        newCategoryId: payload.newCategoryId,
        newCategoryName: payload.newCategoryName,
      })
      .catch(() => {
        // Ignore API errors in mock mode
        console.log(
          "🔧 Mock mode: API call failed, but that's OK (using optimistic update)"
        );
      });

    console.log("✅ Mock API: Task move completed successfully");
    return;
  }

  // Production mode: Use real API
  try {
    await networkInstance.patch(
      `${Api.boards}/${payload.boardId}/tasks/${payload.taskId}/move`,
      {
        oldCategoryId: payload.oldCategoryId,
        newCategoryId: payload.newCategoryId,
        newCategoryName: payload.newCategoryName,
      }
    );
  } catch (error) {
    console.error("Error moving task:", error);
    throw error;
  }
};
