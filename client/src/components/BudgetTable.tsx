import { Table } from "react-bootstrap";
import { useState } from "react";
import { Budget, Expense } from "../api/api";
import { BudgetRowComponent } from "./BudgetRowComponent";
import BudgetItemModal from "./BudgetModal";

//Annelie

interface BudgetTableProps {
    budgets: Budget[];
  
    loadBudgets: () => void;
    expenses: { [budget_id: number]: Expense[] };
    loadExpenses: () => void;
    updateBudgetCost: (id: number, category: string, amount: number) => void;
    isEditing: boolean;
}

export function BudgetTable({ budgets, loadBudgets, expenses, loadExpenses, updateBudgetCost, isEditing }: BudgetTableProps) {

    const totalBudget = budgets.reduce((total, budget) => total + budget.amount, 0);
    const totalExpenses = Object.values(expenses).flat().reduce((total, expense) => total + expense.cost, 0);
    const result = totalBudget - totalExpenses;

    const [showBudgeteModal, setShowBudgetModal] = useState(false);
    

    return (
        <section className="bg-light-subtle rounded d-flex flex-column h-100 w-100">
            <div className="flex-grow-1 overflow-auto table-responsive">
                <Table striped  className="budget-table p-2  text-center">
                    <thead>
                        <tr>
                            <th>
                                <div className="m-auto py-2">Category</div>
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
                            <th>
                                </th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgets.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center p-3">
                                    <p>Create Your First Budget!</p>
                                    <button onClick={() => setShowBudgetModal(true)} className="expense-row-btn">
                                        Add Budget +
                                    </button>
                                </td>
                            </tr>
                        ) : (
                            budgets.map(budget => (
                                <BudgetRowComponent
                                    key={budget.id} 
                                    budget={budget}
                                    loadBudgets={loadBudgets}
                                    loadExpenses={loadExpenses}
                                    expenses={expenses[budget.id] || []}
                                    isEditing={isEditing} 
                                    updateBudgetCost={updateBudgetCost}
                                />
                            ))
                        )}
                    </tbody>
                </Table>
            </div>

            <div className="p-4 m-2 rounded text-center d-flex fw-bold justify-content-between text-white" id="total-row">
                <div className="flex-fill">Total</div>
                <div className="flex-fill">{totalBudget} :-</div>
                <div className="flex-fill">{totalExpenses} :-</div>
                <div className="flex-fill">{result} :-</div>
            </div>

            <BudgetItemModal show={showBudgeteModal} handleClose={() => setShowBudgetModal(false)} onSave={loadBudgets} />
        
        </section>
    );
}
