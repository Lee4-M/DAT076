import { Table } from "react-bootstrap";

import { Budget, Expense } from "../api/api";
import { BudgetRowComponent } from "./BudgetRowComponent";

interface BudgetTableProps {
    budgets: Budget[];
    loadBudgets: () => void;
    expenses: { [budget_id: number]: Expense[] };
    loadExpenses: () => void;
}

export function BudgetTable({ budgets, loadBudgets, expenses, loadExpenses }: BudgetTableProps) {
    
    const totalBudget = budgets.reduce((total, budget) => total + budget.amount, 0);
    const totalExpenses = Object.values(expenses).flat().reduce((total, expense) => total + expense.cost, 0);
    const result = totalBudget - totalExpenses;

    return (
        <section className="bg-light-subtle rounded d-flex flex-column h-100 w-100">
            <div className="flex-grow-1 overflow-auto table-responsive">
                <Table striped bordered hover className="budget-table p-2  text-center">
                    <thead>
                        <tr>
                            <th>
                                <div className="w-75 m-auto py-2">Category</div>
                            </th>
                            <th>
                                <div className="w-75 m-auto py-2">Budget</div>
                            </th>
                            <th>
                                <div className="w-75 m-auto py-2">Expense</div>
                            </th>
                            <th>
                                <div className="w-75 m-auto py-2">Result</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgets.map(budget => (
                            <BudgetRowComponent key={budget.category} budget={budget} loadBudgets={loadBudgets} loadExpenses={loadExpenses} expenses={expenses[budget.id] || []} /> //TODO Change back to index?
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
