import { useState, useRef } from 'react';

import '../routes/App.css'
import { Budget, deleteBudget, Expense } from '../api/api';
import { ExpenseAccordion } from './ExpenseAccordion';

//Annelie

interface BudgetRowComponentProps {
    budget: Budget;
    loadBudgets: () => void;
    expenses: Expense[];
    loadExpenses: () => void;
    isEditing: boolean;
    onEdit: (id: number, category: string, amount: number) => void;
    onSave: () => void;
}

export function BudgetRowComponent({ budget, loadBudgets, expenses, loadExpenses, isEditing, onEdit, onSave }: BudgetRowComponentProps) {
    const [showExpenseAccordion, setShowExpenseAccordion] = useState(false);
    const categoryInputRef = useRef<HTMLInputElement>(null);

    const handleChangeCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
        onEdit(budget.id, e.target.value, budget.amount);
    };

    const handleChangeBudgetCost = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onEdit(budget.id, budget.category, value === "" ? NaN : Number(value));
    };

    const handleSaveOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            onSave();
        }
    };

    async function removeBudget(id: number) {
        const success = await deleteBudget(id);
        if (success) {
            loadBudgets();
            console.log("Budget deleted");
        } else {
            console.log("Failed to delete budget");
        }
    }

    const handleOpenAccordion = () => {
        setShowExpenseAccordion((prev) => !prev);
    };

    return (
        <>
            <tr data-testid="budget-row" className="budget-row hovering" onClick={handleOpenAccordion}>
            <td>
                    {isEditing ? (
                        <input
                            type="text"
                            ref={categoryInputRef}
                            value={budget.category}
                            onChange={handleChangeCategory}
                            onKeyDown={handleSaveOnEnter}
                        />
                    ) : (
                         <span>{budget.category}</span>
                    )}
                </td>
                <td>
                    {isEditing ? (
                        <input
                            type="number"
                            value={budget.amount}
                            onChange={handleChangeBudgetCost}
                            onKeyDown={handleSaveOnEnter}
                            autoFocus
                        />
                    ) : (
                         <span>{budget.amount} :-</span>
                    )}
                </td>
                <td data-testid="total-expenses">{expenses.reduce((total, expense) => total + expense.cost, 0)} :-</td>
                <td 
                    data-testid="variance"
                    style={{ color: (budget.amount - expenses.reduce((total, expense) => total + expense.cost, 0)) < 0 ? 'red' : 'black' }}
                >
                    {budget.amount - expenses.reduce((total, expense) => total + expense.cost, 0)} :-
                </td>
                <td className='text-center col-1 ps-0'>
                  <img 
                      src={showExpenseAccordion ? "/images/arrow-down.svg" : "/images/arrow-left.svg"} 
                      alt="Toggle Arrow" 
                      width="15" 
                      height="15" 
                      style={{ display: "block", margin: "auto" }}
                  />

                </td>
            </tr>

            {showExpenseAccordion && (
                <tr>
                    <td colSpan={4}>
                        <ExpenseAccordion
                            show={showExpenseAccordion}
                            expenses={expenses}
                            handleClose={() => setShowExpenseAccordion(false)}
                            loadExpenses={loadExpenses}
                            deleteBudget={removeBudget}
                            budgetId={budget.id}
                        />
                    </td>
                </tr>
            )}
        </>
    );
}


