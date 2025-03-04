import { Table } from "react-bootstrap";

import { Budget, getExpenses } from "../api/api";
import { BudgetRowComponent } from "./BudgetRowComponent";
import { useEffect, useState } from "react";

interface BudgetTableProps {
    budgets: Budget[];
    deleteExpense: (id: number) => void;
    deleteBudget: (id: number) => void;
}

export function BudgetTable({ budgets, deleteExpense, deleteBudget }: BudgetTableProps) {
    const [totalExpenses, setTotalExpenses] = useState<number>(0);

    const totalBudget = budgets.reduce((total, budget) => total + budget.amount, 0);

    async function getTotalExpenses(budgets: Budget[]): Promise<number> {
        const expensePromises = budgets.map(async (budget) => {
            const expenses = await getExpenses(budget.id); // Fetch expenses for each budget row
            return expenses.reduce((total, expense) => total + expense.cost, 0);
        });

        const expensesPerBudget = await Promise.all(expensePromises); // Wait for all expenses to be fetched
        return expensesPerBudget.reduce((sum, expenseTotal) => sum + expenseTotal, 0);
    }

    useEffect(() => {
        async function fetchTotalExpenses() {
            const total = await getTotalExpenses(budgets);
            setTotalExpenses(total);
        }

        fetchTotalExpenses();
    }, [budgets]);

    const result = totalBudget - totalExpenses;

    return (
        <section className="bg-light-subtle rounded d-flex flex-column h-100 w-100">
            <div className="flex-grow-1 overflow-auto table-responsive">
                <Table striped bordered hover className="p-2 table-striped text-center">
                    <thead>
                        <tr>
                            <th></th>
                            <th className="pb-0">
                                <div className="w-75 m-auto py-2">Budget</div>
                            </th>
                            <th className="pb-0">
                                <div className="w-75 m-auto py-2">Expense</div>
                            </th>
                            <th className="pb-0">
                                <div className="w-75 m-auto py-2">Result</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgets.map(budget => (
                            <BudgetRowComponent key={budget.category} budget={budget} deleteBudget={deleteBudget} deleteExpense={deleteExpense} /> //TODO Change back to index?

                        ))}
                    </tbody>
                </Table>
            </div>

            <div className="p-4 m-2 rounded text-center d-flex fw-bold justify-content-between text-white" id="total-row">
                <div className="flex-fill">Total</div>
                <div className="flex-fill">{totalBudget} :-</div>
                <div className="flex-fill">{totalExpenses} :-</div>
                <div className="flex-fill">{result} :-</div>
            </div>
        </section>
    );
}
