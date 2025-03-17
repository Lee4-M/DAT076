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

export async function getExpenses(budgetRowId: number): Promise<Expense[] | undefined> {
    try {
        const response = await axios.get<Expense[]>(`${BASE_URL}/expense/${budgetRowId}`);
        return response.data
    } catch (e: any) {
        console.log(e);
        return undefined;
    }
}

export async function getBudgets(): Promise<Budget[] | undefined> {
    try {
        const response = await axios.get<Budget[]>(`${BASE_URL}/budget`)
        return response.data
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

export async function getBudget(category: string): Promise<Budget | undefined> {
    try {    
        const response = await axios.get<Budget>(`${BASE_URL}/budget?category=${category}`);
        return response.data;
    } catch (e: any) {
        console.log(e);
        return undefined;
    }
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

export async function addBudget(category: string, amount: number): Promise<Budget | undefined> {
    try {
        console.log("Sending POST request to:", `${BASE_URL}/budget`, { category: category, amount: amount });
        const response = await axios.post<Budget>(`${BASE_URL}/budget`, { category: category, amount: amount });
        return response.data;
    } catch (e: any) {
        console.log(e);
        return undefined;
    }
}

export async function deleteExpense(id: number): Promise<boolean> {
    try {
        const response = await axios.delete(`${BASE_URL}/expense/${id}`);

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
        const response = await axios.delete(`${BASE_URL}/budget/${budgetRowId}`);

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

export async function updateBudgetRow(id: number, category: string, amount: number): Promise<Budget | undefined> {
    try {
        const response = await axios.put(`${BASE_URL}/budget/${id}`, { category: category, amount: amount });
        return response.data;
    } catch (e: any) {
        console.log(e);
        return undefined;
    }
}

export async function updateExpense(id: number, cost: number, description: string, budgetRowId?: number): Promise<Expense | undefined> {
    try {
        const response = await axios.put(`${BASE_URL}/expense/${id}`, { cost: cost, description: description, budgetRowId: budgetRowId } );
        return response.data;
    } catch (e: any) {
        console.log(e);
        return undefined;
    }
}

export async function updateBudgetRows(budgets: Budget[]): Promise<Budget[] | undefined> {
    try {
        const ids: number[] = [];
        const categories: string[] = [];
        const amounts: number[] = [];

        for (const budget of budgets) {
            ids.push(budget.id);
            categories.push(budget.category);
            amounts.push(budget.amount);
        }
        const response = await axios.put(`${BASE_URL}/budgets`, { ids: ids, categories: categories, amounts: amounts });
        return response.data;
    } catch (e: any) {
        console.log(e);
        return undefined;
    }
}

export async function updateExpenses(ids: number[], costs: number[], descriptions: string[]): Promise<Expense[] | undefined> {
    try {
        const response = await axios.put(`${BASE_URL}/expenses`, { costs: costs, descriptions: descriptions }, { params: { ids: ids } });
        return response.data;
    } catch (e: any) {
        console.log(e);
        return undefined;
    }
}