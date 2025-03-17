import axios from "axios";

const BASE_URL = "http://localhost:8080";

axios.defaults.withCredentials = true;

/* Register a new user with username and password */
export async function registerUser(username: string, password: string): Promise<void> {
    try {
        const response = await axios.post(`${BASE_URL}/user`, { username, password });
        return response.data;
    } catch (error: any) {
        console.error("Registration failed:", error);
        throw error;
    }
};

/* Logs in a user with username and password */
export async function login(username: string, password: string): Promise<void> {
    try {
        const response = await axios.post(`${BASE_URL}/user/login`, { username, password });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Unknown login error";
    }
};

/* Logs out current user  */
export async function logout(): Promise<void> {
    try {
        await axios.post(`${BASE_URL}/user/logout`);
        console.log("Logged out successfully");
    } catch (error: any) {
        console.error("Logout failed:", error.response?.data?.error || "Unknown error");
    }
};






