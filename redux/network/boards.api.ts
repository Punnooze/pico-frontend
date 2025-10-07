/**
 * NETWORK LAYER (API Calls)
 *
 * This file contains all API calls related to boards.
 * By centralizing API calls here, we can:
 * 1. Easily change API endpoints
 * 2. Add authentication headers in one place
 * 3. Handle errors consistently
 * 4. Test API calls independently
 *
 * We use axios for making HTTP requests (similar to fetch but with more features)
 */

import axios from "axios";

// Define the base URL for your API
// TODO: Replace with your actual API URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * TypeScript Interface: Defines the shape of a Board object
 * This ensures type safety throughout our application
 */
export interface Board {
  id: string;
  name: string;
  color: string;
  userId: string;
  starred: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch boards for a specific user
 *
 * @param userId - The ID of the user whose boards we want to fetch
 * @returns Promise<Board[]> - An array of board objects
 *
 * The async/await syntax makes asynchronous code look synchronous
 * axios.get returns a Promise that resolves with the response
 */
export const getBoardsApi = async (userId: string): Promise<Board[]> => {
  try {
    // Make GET request with userId as a query parameter
    // URL will look like: http://localhost:3001/api/getBoards?userId=123
    const response = await axios.get(`${API_BASE_URL}/getBoards`, {
      params: { userId },
    });

    // Return the data from the response
    return response.data;
  } catch (error) {
    // If the API call fails, throw the error so our saga can catch it
    console.error("Error fetching boards:", error);
    throw error;
  }
};

/**
 * Example: Create a new board
 * This shows how you'd add more API calls in the future
 */
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
