import axios from "axios";

const BASE_URL = "http://localhost:8080/auth";

axios.defaults.withCredentials = true; 

// Function to handle login
export async function login(username: string, password: string):Promise<void> {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { username, password });
    console.log("Logged in successfully:", response.data);
    return response.data; // Return user data
  } catch (error: any) {
    throw error.response?.data?.error || "Unknown login error";
  }
};

// Function to handle logout
export async function logout(): Promise<void>{
  try {
    await axios.post(`${BASE_URL}/logout`);
    console.log("Logged out successfully");
  } catch (error: any) {
    console.error("Logout failed:", error.response?.data?.error || "Unknown error");
  }
};


export async function getSessionUser(): Promise<any | null> {
  try {
    const response = await axios.get(`${BASE_URL}/session`, {
      withCredentials: true,
    });
    return response.data.user;
  } catch (error: any) {
    console.error("Failed to fetch session user:", error.response?.data?.error || "Unknown error");
    return null;
  }
};


