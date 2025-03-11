import axios from 'axios';

axios.defaults.withCredentials = true;

export type Budget = {
    id: number
    category: string;
    amount: number;
    userId: number;
}

export type Expense = {
    id: number;
    budgetRowId: number;
    cost: number;
    description: string;
}

const BASE_URL = "http://localhost:8080"

export async function getExpenses(budgetRowId: number): Promise<Expense[]> {
    const response = await axios.get<Expense[]>(`${BASE_URL}/expense`, { params: { budgetRowId: budgetRowId } })
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

export async function deleteExpense(id: number): Promise<boolean> {
    try {
        console.log("Sending DELETE request to:", `${BASE_URL}/expense/${id}`);

        const response = await axios.delete(`${BASE_URL}/expense`, { data: { id: id } });

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

export async function deleteBudget(budgetRowId: number): Promise<boolean> {
    try {
        const response = await axios.delete(`${BASE_URL}/budget`, { data: { id: budgetRowId } });

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

export async function updateBudget(category: string, amount: number): Promise<Budget | undefined> {
    try {
        const response = await axios.put(`${BASE_URL}/budget`, { category: category, cost: amount });
        return response.data;
    } catch (e: any) {
        console.log(e);
        return undefined;
    }
}

export async function updateBudgets(budgets : Budget[]): Promise<Budget[] | undefined> {
    try {
        let categories: string[] = [];
        let amounts: number[] = [];

        for (let budget of budgets) {
            categories.push(budget.category);
            amounts.push(budget.cost);
        }
        const response = await axios.put(`${BASE_URL}/budgets`, { categories: categories, costs: amounts });
        return response.data;
    } catch (e: any) {
        console.log(e);
        return undefined;
    }
}