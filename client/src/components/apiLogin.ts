import axios from "axios";

const BASE_URL = "http://localhost:8080";

axios.defaults.withCredentials = true;

export async function login(username: string, password: string): Promise<void> {
  try {
    const response = await axios.post(`${BASE_URL}/user/login`, { username, password });
    console.log("Logged in successfully:", response.data);
    return response.data; // Return user data
  } catch (error: any) {
    throw error.response?.data?.error || "Unknown login error";
  }
};

export async function logout(): Promise<void> {
  try {
    await axios.post(`${BASE_URL}/user/logout`);
    console.log("Logged out successfully");
  } catch (error: any) {
    console.error("Logout failed:", error.response?.data?.error || "Unknown error");
  }
};

export async function registerUser(username: string, password: string): Promise<void> {
  try {
    const response = await axios.post(`${BASE_URL}/user`, { username: username, password: password });
    console.log("Register response:", response.data);
    return response.data;
  } catch (e: unknown) {
    console.log(e);
  }
}





