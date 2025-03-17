import { useState, useRef } from 'react';

import '../routes/App.css'
import { Budget, deleteBudget, Expense } from '../api/api';
import { ExpenseAccordion } from './ExpenseAccordion';

interface BudgetRowComponentProps {
    budget: Budget;
    expenses: Expense[];
    isEditing: boolean;
    loadBudgets: () => void;
    loadExpenses: () => void;
    handleChangeBudgets: (id: number, changes: Partial<Budget>) => void;
    handleSaveBudgetRows: () => void;
}

export function BudgetRowComponent({ budget, expenses, isEditing, loadBudgets, loadExpenses, handleChangeBudgets, handleSaveBudgetRows }: BudgetRowComponentProps) {
    const [showExpenseAccordion, setShowExpenseAccordion] = useState(false);
    const categoryInputRef = useRef<HTMLInputElement>(null);

    const handleSaveOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSaveBudgetRows();
        }
    };

    async function handleDeleteBudget(id: number) {
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
                            title="input-category"
                            type="text"
                            ref={categoryInputRef}
                            value={budget.category}
                            onChange={(e) => handleChangeBudgets(budget.id, { category: e.target.value })}
                            onKeyDown={handleSaveOnEnter}
                        />
                    ) : (
                         <span>{budget.category}</span>
                    )}
                </td>
                <td>
                    {isEditing ? (
                        <input
                            title="input-amount"
                            type="number"
                            value={budget.amount}
                            onChange={(e) => handleChangeBudgets(budget.id, { amount: parseInt(e.target.value) })}
                            onKeyDown={handleSaveOnEnter}
                            autoFocus
                        />
                    ) : (
                         <span>{budget.amount} :-</span>
                    )}
                </td>
                <td data-testid="total-expenses">
                    {expenses.reduce((total, expense) => total + expense.cost, 0)} :-
                </td>
                <td data-testid="variance"
                    style={{ color: (budget.amount - expenses.reduce((total, expense) => total + expense.cost, 0)) < 0 ? "#b80000" : 'black' }}
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
                            expenses={expenses}
                            handleClose={() => setShowExpenseAccordion(false)}
                            loadExpenses={loadExpenses}
                            loadBudgets={loadBudgets}
                            deleteBudget={handleDeleteBudget}
                            budgetId={budget.id}
                        />
                    </td>
                </tr>
            )}
        </>
    );
}


