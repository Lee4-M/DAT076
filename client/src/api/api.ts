import axios from 'axios';

axios.defaults.withCredentials = true;

export type Budget = {
    category: string;
    cost: number;
    expenses: Expense[];
    result: number;
}

export type Expense = {
    category: string;
    cost: number;
    description: string;
    id: string;
}

const BASE_URL = "http://localhost:8080"

export async function getExpenses(): Promise<Expense[]> {
    const response = await axios.get<Expense[]>(`${BASE_URL}/expense`)
    return response.data
}

export async function getBudgets(): Promise<Budget[]> {
    const response = await axios.get<Budget[]>(`${BASE_URL}/budget`)
    return response.data
}

export async function getBudget(category: string): Promise<Budget> {
    const response = await axios.get<Budget>(`${BASE_URL}/budget?category=${category}`);
    return response.data;
}

export async function addExpense(category: string, cost: number, description: string): Promise<Expense | undefined> {
    try {
        const response = await axios.post<Expense>(`${BASE_URL}/expense`, { category: category, cost: cost, description: description });
        return response.data;
    } catch (e: any) {
        console.log(e);
        return undefined;
    }
}

export async function addBudget(category: string, cost: number): Promise<Budget | undefined> {
    try {
        const response = await axios.post<Budget>(`${BASE_URL}/budget`, { category: category, cost: cost });
        return response.data;
    } catch (e: any) {
        console.log(e);
        return undefined;
    }
}

export async function delExpense(id: string): Promise<boolean> {
    try {
        console.log("Sending DELETE request to:", `${BASE_URL}/expense/${id}`);

        const response = await axios.delete(`${BASE_URL}/expense/${id}`, { data: {id: id}});

        if (response.status === 200) {
            console.log("Expense deleted successfully.");
            return true;
        } else {
            console.error(`Unexpected response status: ${response.status}`);
            return false;
        }
    } catch (e: any) {
        console.error("Error deleting expense:", e.response?.data || e.message);
        return false;
    }
}

export async function delBudget(category: string): Promise<boolean> {
    try {
        const response = await axios.delete(`${BASE_URL}/budget`, { data: { category: category } });
        
        if (response.status === 200) {
            return true; // Deleted budget
        } else {
            console.log(`Unexpected response status: ${response.status}`);
            return false;
        }
        
    } catch (e: any) {
        console.log(e);
        return false;
    }
}

