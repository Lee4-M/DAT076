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

export async function deleteExpense(id: string) {
    try {
        await axios.delete(`${BASE_URL}/expense/${id}`);
    } catch (e: any) {
        console.log(e);
    }
}