import axios from "axios";

const API_URL = "https://product.api.azzurenest.com/api/v1/data";

export const fetchData = async <T>(query: string): Promise<T> => {
  try {
    const response = await axios.post<{ data: T }>(API_URL, {
      query: query,
    });
    return response.data.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
