import { Table } from "react-bootstrap";
import { Budget } from "./api";
import { BudgetComponent } from "./BudgetComponent";

interface BudgetTableProps {
    budgets: Budget[];
    deleteExpense: (id: string) => void;
    deleteBudget: (category: string) => void;
}

export function BudgetTable({ budgets, deleteExpense, deleteBudget }: BudgetTableProps) {

    let totalBudget = budgets.reduce((total, budget) => total + budget.cost, 0);
    let totalExpenses = budgets.reduce((sum, budget) =>
        sum + budget.expenses.reduce((total, expense) => total + expense.cost, 0),
        0);
    let result = totalBudget - totalExpenses;

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
                            <BudgetComponent key={budget.category} budget={budget} deleteBudget={deleteBudget} deleteExpense={deleteExpense}/> //TODO Change back to index?

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
